#!/usr/bin/env python3
"""Require CSS aspect-ratio and self-links on every content image.

Imported posts used to ship `style="aspect-ratio: W / H"` on each <img>
(Tumblr leftover, removed in PR #7). That is the CLS pattern this site
uses: reserve the box in CSS while `width: 100%; height: auto` keeps
display fluid.

Content photos must also be wrapped so a click opens the file itself:

  <a href="/media/…/1.jpg"><img src="/media/…/1.jpg" …></a>

This check fails when a content <img> or <video> is missing that
inline style, or when the ratio does not match the referenced local
file, or when a content <img> is not wrapped in <a href="same-src">.
Header avatars are skipped (fixed CSS size, link home). Videos are
not wrapped. Template files may point at placeholder paths that do
not exist; they still need the style and the self-link wrap.

Usage:
  python3 scripts/check_img_aspect_ratio.py
  python3 scripts/check_img_aspect_ratio.py --fix
"""

from __future__ import annotations

import argparse
import math
import re
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
HTML_ROOTS = (SITE, ROOT / "templates")
CSS_PATH = SITE / "css" / "style.css"

IMG_TAG_RE = re.compile(r"<img\b([^>]*)>", re.I)
VIDEO_OPEN_RE = re.compile(r"<video\b([^>]*)>", re.I)
A_OPEN_RE = re.compile(r"<a\b([^>]*)>", re.I)
A_CLOSE_RE = re.compile(r"</a\s*>", re.I)
COMMENT_RE = re.compile(r"<!--.*?-->", re.S)
SOURCE_SRC_RE = re.compile(r"<source\b[^>]*\bsrc\s*=\s*['\"]([^'\"]+)['\"]", re.I)
ATTR_RE = re.compile(
    r"""([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?""",
    re.I,
)
ASPECT_RE = re.compile(
    r"aspect-ratio\s*:\s*(\d+(?:\.\d+)?)\s*/\s*(\d+(?:\.\d+)?)",
    re.I,
)
CLASS_RE = re.compile(r"\bavatar\b", re.I)
URL_HOST_RE = re.compile(r"^https?://dad\.evanjon\.es(/.*)$", re.I)

# Ratios within this relative error count as a match (covers 1536/2048 vs 1280/1707).
RATIO_TOLERANCE = 0.002

ORIENT_SWAP = {5, 6, 7, 8}


def parse_attrs(raw: str) -> dict[str, str]:
    attrs: dict[str, str] = {}
    for match in ATTR_RE.finditer(raw):
        name = match.group(1).lower()
        value = match.group(2)
        if value is None:
            value = match.group(3)
        if value is None:
            value = match.group(4)
        if value is None:
            value = ""
        attrs[name] = value
    return attrs


def aspect_from_style(style: str) -> tuple[float, float] | None:
    match = ASPECT_RE.search(style or "")
    if not match:
        return None
    return float(match.group(1)), float(match.group(2))


def ratios_match(aw: float, ah: float, fw: float, fh: float) -> bool:
    if aw <= 0 or ah <= 0 or fw <= 0 or fh <= 0:
        return False
    return math.isclose(aw / ah, fw / fh, rel_tol=RATIO_TOLERANCE, abs_tol=1e-6)


def local_path(src: str) -> Path | None:
    if not src or src.startswith("data:"):
        return None
    hosted = URL_HOST_RE.match(src)
    if hosted:
        src = hosted.group(1)
    if src.startswith("https://") or src.startswith("http://"):
        return None
    if src.startswith("/"):
        return SITE / src.lstrip("/")
    return None


def jpeg_display_size(data: bytes) -> tuple[int, int] | None:
    if data[:2] != b"\xff\xd8":
        return None
    i = 2
    n = len(data)
    width = height = None
    orient = 1
    while i + 4 <= n:
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        i += 2
        if marker in (0xD8, 0xD9):
            continue
        if marker == 0xDA:
            break
        if i + 2 > n:
            break
        seglen = struct.unpack(">H", data[i : i + 2])[0]
        if seglen < 2 or i + seglen > n:
            break
        payload = data[i + 2 : i + seglen]
        if marker in (
            0xC0,
            0xC1,
            0xC2,
            0xC3,
            0xC5,
            0xC6,
            0xC7,
            0xC9,
            0xCA,
            0xCB,
            0xCD,
            0xCE,
            0xCF,
        ) and len(payload) >= 5:
            height, width = struct.unpack(">HH", payload[1:5])
        if marker == 0xE1 and payload.startswith(b"Exif\x00\x00"):
            tiff = payload[6:]
            if len(tiff) >= 8:
                endian = "<" if tiff[0:2] == b"II" else ">"
                magic = b"\x2a\x00" if endian == "<" else b"\x00\x2a"
                if tiff[2:4] == magic:
                    off = struct.unpack(endian + "I", tiff[4:8])[0]
                    if off + 2 <= len(tiff):
                        count = struct.unpack(endian + "H", tiff[off : off + 2])[0]
                        for k in range(count):
                            entry = off + 2 + k * 12
                            if entry + 12 > len(tiff):
                                break
                            tag, typ, _cnt = struct.unpack(
                                endian + "HHI", tiff[entry : entry + 8]
                            )
                            val = tiff[entry + 8 : entry + 12]
                            if tag == 0x0112 and typ == 3:
                                orient = struct.unpack(endian + "H", val[:2])[0]
        i += seglen
    if width is None or height is None:
        return None
    if orient in ORIENT_SWAP:
        width, height = height, width
    return width, height


def png_size(data: bytes) -> tuple[int, int] | None:
    if data[:8] != b"\x89PNG\r\n\x1a\n" or len(data) < 24:
        return None
    return struct.unpack(">II", data[16:24])


def gif_size(data: bytes) -> tuple[int, int] | None:
    if data[:6] not in (b"GIF87a", b"GIF89a") or len(data) < 10:
        return None
    return struct.unpack("<HH", data[6:10])


def _mp4_boxes(data: bytes, start: int = 0, end: int | None = None):
    if end is None:
        end = len(data)
    i = start
    while i + 8 <= end:
        size = struct.unpack(">I", data[i : i + 4])[0]
        typ = data[i + 4 : i + 8]
        if size == 1:
            if i + 16 > end:
                break
            size = struct.unpack(">Q", data[i + 8 : i + 16])[0]
            header = 16
        elif size == 0:
            size = end - i
            header = 8
        else:
            header = 8
        if size < header or i + size > end:
            break
        yield typ, i + header, i + size
        i += size


def mp4_size(data: bytes) -> tuple[int, int] | None:
    visual = None
    tkhd = None
    for typ, start, end in _mp4_boxes(data):
        if typ == b"moov":
            for t2, s2, e2 in _mp4_boxes(data, start, end):
                if t2 != b"trak":
                    continue
                for t3, s3, e3 in _mp4_boxes(data, s2, e2):
                    if t3 == b"tkhd" and e3 - s3 >= 80:
                        version = data[s3]
                        if version == 1:
                            wh_off = s3 + 92
                        else:
                            wh_off = s3 + 76
                        if wh_off + 8 <= e3:
                            w = struct.unpack(">I", data[wh_off : wh_off + 4])[0] >> 16
                            h = struct.unpack(">I", data[wh_off + 4 : wh_off + 8])[0] >> 16
                            if w and h:
                                tkhd = (w, h)
                    if t3 == b"mdia":
                        for t4, s4, e4 in _mp4_boxes(data, s3, e3):
                            if t4 != b"minf":
                                continue
                            for t5, s5, e5 in _mp4_boxes(data, s4, e4):
                                if t5 != b"stbl":
                                    continue
                                for t6, s6, e6 in _mp4_boxes(data, s5, e5):
                                    if t6 != b"stsd":
                                        continue
                                    # stsd: version/flags (4) + entry_count (4)
                                    p = s6 + 8
                                    if p + 8 > e6:
                                        continue
                                    count = struct.unpack(">I", data[p : p + 4])[0]
                                    p += 4
                                    for _ in range(count):
                                        if p + 8 > e6:
                                            break
                                        esize = struct.unpack(">I", data[p : p + 4])[0]
                                        etyp = data[p + 4 : p + 8]
                                        # Visual sample entry: width/height at +24 after 8-byte box hdr + 8 reserved + 2 data-ref
                                        # ISO visual sample entry: 8 header + 6 reserved + 2 data_reference + 16 pre_defined/reserved
                                        # then width (2) height (2) at offset 32 from box start (24 from payload).
                                        if etyp in (
                                            b"avc1",
                                            b"avc3",
                                            b"hev1",
                                            b"hvc1",
                                            b"mp4v",
                                            b"vp09",
                                            b"av01",
                                        ) and esize >= 40:
                                            w, h = struct.unpack(
                                                ">HH", data[p + 32 : p + 36]
                                            )
                                            if w and h:
                                                visual = (w, h)
                                        p += esize
    return visual or tkhd


def media_size(path: Path) -> tuple[int, int] | None:
    suffix = path.suffix.lower()
    data = path.read_bytes()
    if suffix in {".jpg", ".jpeg"}:
        return jpeg_display_size(data)
    if suffix == ".png":
        return png_size(data)
    if suffix == ".gif":
        return gif_size(data)
    if suffix in {".mp4", ".m4v", ".mov"}:
        return mp4_size(data)
    if suffix == ".webp" and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        # VP8 lossless / simple: skip — not used on this site
        return None
    return None


def set_aspect_style(attr_raw: str, width: int, height: int) -> str:
    attrs = parse_attrs(attr_raw)
    style = attrs.get("style", "").strip().rstrip(";")
    new_decl = f"aspect-ratio: {width} / {height}"
    if ASPECT_RE.search(style):
        style = ASPECT_RE.sub(new_decl, style, count=1)
    elif style:
        style = f"{style}; {new_decl}"
    else:
        style = new_decl
    if re.search(r"\bstyle\s*=", attr_raw, re.I):
        return re.sub(
            r"""\bstyle\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+)""",
            f'style="{style}"',
            attr_raw,
            count=1,
            flags=re.I,
        )
    return attr_raw.rstrip() + f' style="{style}"'


def html_files() -> list[Path]:
    files: list[Path] = []
    for root in HTML_ROOTS:
        files.extend(sorted(root.rglob("*.html")))
    return files


def is_template(path: Path) -> bool:
    try:
        path.relative_to(ROOT / "templates")
        return True
    except ValueError:
        return False


def skip_img(attrs: dict[str, str]) -> bool:
    return bool(CLASS_RE.search(attrs.get("class", "")))


def open_anchor_before(html: str, pos: int) -> re.Match[str] | None:
    """Innermost <a> that is still open at pos, or None."""
    before = html[:pos]
    last_open = None
    for match in A_OPEN_RE.finditer(before):
        last_open = match
    if last_open is None:
        return None
    last_close = None
    for match in A_CLOSE_RE.finditer(before):
        last_close = match
    if last_close is not None and last_close.start() > last_open.start():
        return None
    return last_open


def is_self_linked(html: str, img_start: int, img_end: int, src: str) -> bool:
    """True when <a href="{src}"> immediately wraps the img."""
    open_a = open_anchor_before(html, img_start)
    if open_a is None:
        return False
    href = parse_attrs(open_a.group(1)).get("href", "")
    if href != src:
        return False
    # Only whitespace between <a> and <img>, and </a> right after.
    between = html[open_a.end() : img_start]
    if between.strip():
        return False
    return bool(re.match(r"\s*</a\s*>", html[img_end:], re.I))


def check_css() -> list[str]:
    errors: list[str] = []
    css = CSS_PATH.read_text(encoding="utf-8")
    # Display size must stay fluid so aspect-ratio cannot paint at intrinsic pixels.
    block = re.search(
        r"\.post-body img\s*,\s*\.post-body video\s*\{([^}]+)\}",
        css,
        re.S,
    )
    if not block:
        return [f"{CSS_PATH.relative_to(ROOT)}: missing .post-body img/video rule"]
    body = block.group(1)
    if not re.search(r"\bwidth\s*:\s*100%\s*;", body):
        errors.append(
            f"{CSS_PATH.relative_to(ROOT)}: .post-body img/video must keep width: 100%"
        )
    if not re.search(r"\bheight\s*:\s*auto\s*;", body):
        errors.append(
            f"{CSS_PATH.relative_to(ROOT)}: .post-body img/video must keep height: auto"
        )
    # Linked photos must not pick up the global <a> underline / accent color.
    link = re.search(
        r"\.post-body a:has\(\s*>\s*img\s*\)\s*\{([^}]+)\}",
        css,
        re.S,
    )
    if not link:
        errors.append(
            f"{CSS_PATH.relative_to(ROOT)}: missing .post-body a:has(> img) rule"
        )
    elif not re.search(r"\btext-decoration\s*:\s*none\s*;", link.group(1)):
        errors.append(
            f"{CSS_PATH.relative_to(ROOT)}: "
            ".post-body a:has(> img) must keep text-decoration: none"
        )
    return errors


def media_for_tag(
    tag: str, attrs: dict[str, str], html: str, tag_end: int
) -> str | None:
    if tag == "img":
        return attrs.get("src")
    src = attrs.get("src")
    if src:
        return src
    # <video>…<source src> — look ahead a short distance
    window = html[tag_end : tag_end + 400]
    match = SOURCE_SRC_RE.search(window)
    if match:
        return match.group(1)
    return attrs.get("poster")


def process_file(path: Path, fix: bool) -> tuple[list[str], bool]:
    html = path.read_text(encoding="utf-8")
    original = html
    errors: list[str] = []
    rel = path.relative_to(ROOT)
    template = is_template(path)
    comments = [(m.start(), m.end()) for m in COMMENT_RE.finditer(html)]

    def in_comment(pos: int) -> bool:
        return any(start <= pos < end for start, end in comments)

    def handle(tag: str, match: re.Match[str]) -> str:
        if in_comment(match.start()):
            return match.group(0)
        raw = match.group(1)
        attrs = parse_attrs(raw)
        if tag == "img" and skip_img(attrs):
            return match.group(0)
        src = media_for_tag(tag, attrs, html, match.end())
        loc = f"{rel}:{html[: match.start()].count(chr(10)) + 1}"
        if not src:
            errors.append(f"{loc}: <{tag}> has no src")
            return match.group(0)

        file_path = local_path(src)
        file_size = None
        if file_path is not None:
            if file_path.is_file():
                file_size = media_size(file_path)
                if file_size is None:
                    errors.append(
                        f"{loc}: could not read dimensions for {file_path.relative_to(ROOT)}"
                    )
                    return match.group(0)
            elif not template:
                errors.append(
                    f"{loc}: missing local file {file_path.relative_to(ROOT)}"
                )
                return match.group(0)

        styled = aspect_from_style(attrs.get("style", ""))
        if file_size and (fix or not styled or not ratios_match(*styled, *file_size)):
            if fix:
                new_raw = set_aspect_style(raw, file_size[0], file_size[1])
                return f"<{tag}{new_raw}>"
            if not styled:
                errors.append(
                    f"{loc}: <{tag}> {src} missing style=\"aspect-ratio: W / H\" "
                    f"(file is {file_size[0]}×{file_size[1]})"
                )
            else:
                errors.append(
                    f"{loc}: <{tag}> {src} aspect-ratio {int(styled[0])} / {int(styled[1])} "
                    f"does not match file {file_size[0]}×{file_size[1]}"
                )
            return match.group(0)

        if not styled:
            hint = ""
            if file_size:
                hint = f" (file is {file_size[0]}×{file_size[1]})"
            elif template:
                hint = " (placeholder: style=\"aspect-ratio: 3 / 4\")"
            errors.append(
                f"{loc}: <{tag}> {src} missing style=\"aspect-ratio: W / H\"{hint}"
            )
        return match.group(0)

    html = IMG_TAG_RE.sub(lambda m: handle("img", m), html)
    html = VIDEO_OPEN_RE.sub(lambda m: handle("video", m), html)

    html, wrap_errors = ensure_self_links(html, rel, fix)
    errors.extend(wrap_errors)

    changed = html != original
    if changed and fix:
        path.write_text(html, encoding="utf-8")
    return errors, changed


def ensure_self_links(
    html: str, rel: Path, fix: bool
) -> tuple[str, list[str]]:
    """Require <a href=img-src> immediately around each content image."""
    errors: list[str] = []
    comments = [(m.start(), m.end()) for m in COMMENT_RE.finditer(html)]

    def in_comment(pos: int) -> bool:
        return any(start <= pos < end for start, end in comments)

    pieces: list[str] = []
    last = 0
    for match in IMG_TAG_RE.finditer(html):
        if in_comment(match.start()):
            continue
        attrs = parse_attrs(match.group(1))
        if skip_img(attrs):
            continue
        src = attrs.get("src")
        loc = f"{rel}:{html[: match.start()].count(chr(10)) + 1}"
        if not src:
            continue
        if is_self_linked(html, match.start(), match.end(), src):
            continue
        open_a = open_anchor_before(html, match.start())
        if open_a is not None:
            href = parse_attrs(open_a.group(1)).get("href", "")
            errors.append(
                f'{loc}: <img> {src} is inside <a href="{href}">; '
                f'href must be the image src (do not nest links)'
            )
            continue
        if fix:
            pieces.append(html[last : match.start()])
            pieces.append(f'<a href="{src}">{match.group(0)}</a>')
            last = match.end()
        else:
            errors.append(
                f'{loc}: <img> {src} must be wrapped in <a href="{src}">'
            )
    if fix and pieces:
        pieces.append(html[last:])
        html = "".join(pieces)
        return html, []
    return html, errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--fix",
        action="store_true",
        help="write style=\"aspect-ratio: W / H\" and wrap content images in self-links",
    )
    args = parser.parse_args()

    errors = check_css()
    changed_any = False
    for path in html_files():
        file_errors, changed = process_file(path, args.fix)
        errors.extend(file_errors)
        changed_any = changed_any or changed

    if args.fix:
        # Re-run without --fix so leftover problems still fail.
        leftover: list[str] = []
        leftover.extend(check_css())
        for path in html_files():
            leftover.extend(process_file(path, fix=False)[0])
        if leftover:
            print("Updated files, but the check still fails:\n", file=sys.stderr)
            print("\n".join(leftover), file=sys.stderr)
            return 1
        if changed_any:
            print("Wrote aspect-ratio styles and self-link wraps from local files.")
        else:
            print(
                "All content images/videos already have matching aspect-ratio "
                "styles and self-link wraps."
            )
        return 0

    if errors:
        print("\n".join(errors), file=sys.stderr)
        print(
            f"\n{len(errors)} problem(s). "
            "Add style=\"aspect-ratio: W / H\" matching the file "
            "(imported posts used this CSS pattern). "
            "Wrap each content <img> in <a href=\"same-src\">. "
            "Display size stays fluid via .post-body img { width: 100%; height: auto; }. "
            "Re-run with --fix to fill values and wraps from local files.",
            file=sys.stderr,
        )
        return 1

    print("OK: content images/videos reserve aspect-ratio and images self-link.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
