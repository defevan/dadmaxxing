#!/usr/bin/env python3
"""Require each post on every tag page it lists.

A post carries one or more tags in the article header, as a sibling of
<time> and .post-body:

  One tag (existing posts):
    <a class="tag" href="/family/">#family</a>

  Several tags:
    <div class="tags">
      <a class="tag" href="/family/">#family</a>
      <a class="tag" href="/climbing/">#climbing</a>
    </div>

The same <article> is pasted onto site/index.html and onto each tag page
it links (site/family/index.html, site/climbing/index.html, ...). Tag text
is # plus that page's directory name.

Usage:
  python3 scripts/check_post_tags.py
"""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
TEMPLATE = ROOT / "templates" / "post.html"
CSS_PATH = SITE / "css" / "style.css"

VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}
ATTR_RE = re.compile(
    r"""([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?""",
    re.I,
)
ARTICLE_RE = re.compile(r"<article\b([^>]*)>(.*?)</article>", re.S | re.I)
TAG_HREF_RE = re.compile(r"^/([a-z0-9-]+)/$")


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


def classes_of(raw: str) -> set[str]:
    return set(parse_attrs(raw).get("class", "").split())


def normalize_article(raw: str) -> str:
    return "\n".join(line.rstrip() for line in raw.strip().splitlines())


def article_sources(html: str) -> list[tuple[str, str]]:
    found: list[tuple[str, str]] = []
    for match in ARTICLE_RE.finditer(html):
        attrs = parse_attrs(match.group(1))
        if "post" not in classes_of(match.group(1)):
            continue
        found.append((attrs.get("id", ""), normalize_article(match.group(0))))
    return found


class _El:
    def __init__(self, tag: str, classes: set[str], line: int) -> None:
        self.tag = tag
        self.classes = classes
        self.line = line


class _Tag:
    def __init__(self, href: str, line: int, where: str) -> None:
        self.href = href
        self.line = line
        self.where = where
        self.text_parts: list[str] = []

    @property
    def text(self) -> str:
        return "".join(self.text_parts).strip()


class _Article:
    def __init__(self, article_id: str, line: int) -> None:
        self.id = article_id
        self.line = line
        self.tags: list[_Tag] = []
        self.wrapper_count = 0
        self.errors: list[str] = []


class ArticleParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.articles: list[_Article] = []
        self._stack: list[_El] = []
        self._current: _Article | None = None
        self._capture: _Tag | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {name.lower(): value or "" for name, value in attrs}
        classes = set(attr.get("class", "").split())
        line = self.getpos()[0]
        parent = self._stack[-1] if self._stack else None
        el = _El(tag, classes, line)

        if tag == "article" and "post" in classes:
            if self._current is not None:
                self._current.errors.append(
                    f"line {line}: nested article.post is not allowed"
                )
            self._current = _Article(attr.get("id", ""), line)

        if self._current is not None and tag == "div" and "tags" in classes:
            if _is_post_article(parent):
                self._current.wrapper_count += 1
            else:
                self._current.errors.append(
                    f"line {line}: <div class=\"tags\"> must be a direct child of <article class=\"post\">"
                )

        if self._current is not None and tag == "a" and "tag" in classes:
            where = _tag_where(self._stack)
            if where == "body":
                self._current.errors.append(
                    f"line {line}: <a class=\"tag\"> belongs in the article header, not .post-body"
                )
            elif where == "other":
                self._current.errors.append(
                    f"line {line}: <a class=\"tag\"> must be a direct child of the article, "
                    "or inside a direct <div class=\"tags\">"
                )
            self._capture = _Tag(attr.get("href", ""), line, where)
            self._current.tags.append(self._capture)

        if (
            self._current is not None
            and parent is not None
            and parent.tag == "div"
            and "tags" in parent.classes
            and _is_post_article(self._stack[-2] if len(self._stack) >= 2 else None)
            and not (tag == "a" and "tag" in classes)
        ):
            self._current.errors.append(
                f"line {line}: <div class=\"tags\"> may only contain <a class=\"tag\"> links"
            )

        self._stack.append(el)
        if tag in VOID_TAGS:
            self._stack.pop()

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag: str) -> None:
        if self._capture is not None and tag == "a":
            self._capture = None
        if self._stack and self._stack[-1].tag == tag:
            self._stack.pop()
        elif self._stack:
            # Keep going so one odd close tag does not hide later articles.
            for index in range(len(self._stack) - 1, -1, -1):
                if self._stack[index].tag == tag:
                    del self._stack[index:]
                    break
        if tag == "article" and self._current is not None and not _inside_post(self._stack):
            self.articles.append(self._current)
            self._current = None

    def handle_data(self, data: str) -> None:
        if self._capture is not None:
            self._capture.text_parts.append(data)
            return
        if self._current is None or not data.strip():
            return
        parent = self._stack[-1] if self._stack else None
        grand = self._stack[-2] if len(self._stack) >= 2 else None
        if (
            parent is not None
            and parent.tag == "div"
            and "tags" in parent.classes
            and _is_post_article(grand)
        ):
            self._current.errors.append(
                f"line {parent.line}: unexpected text {data.strip()!r} inside <div class=\"tags\">"
            )


def _is_post_article(el: _El | None) -> bool:
    return el is not None and el.tag == "article" and "post" in el.classes


def _inside_post(stack: list[_El]) -> bool:
    return any(_is_post_article(el) for el in stack)


def _tag_where(stack: list[_El]) -> str:
    if any("post-body" in el.classes for el in stack):
        return "body"
    parent = stack[-1] if stack else None
    if _is_post_article(parent):
        return "bare"
    grand = stack[-2] if len(stack) >= 2 else None
    if (
        parent is not None
        and parent.tag == "div"
        and "tags" in parent.classes
        and _is_post_article(grand)
    ):
        return "wrapper"
    return "other"


def parse_articles(html: str) -> list[_Article]:
    parser = ArticleParser()
    parser.feed(html)
    parser.close()
    return parser.articles


def _rel(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def validate_tags(article: _Article, rel: str, tag_pages: set[str]) -> list[str]:
    errors = [f"{rel}: {message}" for message in article.errors]
    label = article.id or "(missing id)"
    if not article.id:
        errors.append(f"{rel}: line {article.line}: article.post is missing id")

    bare = [tag for tag in article.tags if tag.where == "bare"]
    wrapped = [tag for tag in article.tags if tag.where == "wrapper"]
    if article.wrapper_count > 1:
        errors.append(f"{rel}: article {label} has more than one <div class=\"tags\">")
    if bare and wrapped:
        errors.append(
            f"{rel}: article {label} mixes a lone <a class=\"tag\"> with <div class=\"tags\">"
        )
    if len(bare) > 1:
        errors.append(
            f"{rel}: article {label} has {len(bare)} tags; wrap them in <div class=\"tags\">"
        )
    if article.wrapper_count and not wrapped:
        errors.append(f"{rel}: article {label} has an empty <div class=\"tags\">")
    if not article.tags:
        errors.append(f"{rel}: article {label} has no tags")

    seen: set[str] = set()
    for tag in article.tags:
        if tag.where not in {"bare", "wrapper"}:
            continue
        match = TAG_HREF_RE.fullmatch(tag.href)
        if not match:
            errors.append(
                f"{rel}: line {tag.line}: tag href {tag.href!r} should look like /family/"
            )
            continue
        slug = match.group(1)
        expected = f"#{slug}"
        if tag.text != expected:
            errors.append(
                f"{rel}: line {tag.line}: tag text {tag.text!r} should be {expected!r} "
                f"to match href {tag.href!r}"
            )
        if slug not in tag_pages:
            errors.append(
                f"{rel}: line {tag.line}: no tag page site/{slug}/index.html for {tag.href}"
            )
        if tag.href in seen:
            errors.append(f"{rel}: article {label} lists {tag.href} more than once")
        seen.add(tag.href)
    return errors


def check_css(css_path: Path) -> list[str]:
    if not css_path.is_file():
        return [f"{_rel(css_path)}: missing stylesheet"]
    css = re.sub(r"/\*.*?\*/", "", css_path.read_text(encoding="utf-8"), flags=re.S)
    blocks: dict[str, str] = {}
    for match in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        body = match.group(2)
        for selector in match.group(1).split(","):
            blocks[selector.strip()] = body

    errors: list[str] = []
    rel = _rel(css_path)

    def require(selector: str, declaration: str) -> None:
        body = blocks.get(selector)
        if body is None:
            errors.append(f"{rel}: missing {selector} rule")
            return
        if not re.search(declaration, body, re.I):
            errors.append(f"{rel}: {selector} must include {declaration}")

    require(r".post > .tag", r"grid-column\s*:\s*2\s*;")
    require(r".post > .tag", r"grid-row\s*:\s*1\s*;")
    require(r".post > .tags", r"grid-column\s*:\s*2\s*;")
    require(r".post > .tags", r"grid-row\s*:\s*1\s*;")
    require(r".tags", r"flex-wrap\s*:\s*nowrap\s*;")
    require(r".tags", r"white-space\s*:\s*nowrap\s*;")
    return errors


def check_template(path: Path, tag_pages: set[str]) -> list[str]:
    rel = _rel(path)
    if not path.is_file():
        return [f"{rel}: missing post template"]
    html = path.read_text(encoding="utf-8")
    articles = parse_articles(html)
    if len(articles) != 1:
        return [f"{rel}: expected one sample article, found {len(articles)}"]
    errors = validate_tags(articles[0], rel, tag_pages)
    wrapped = [tag for tag in articles[0].tags if tag.where == "wrapper"]
    if len(wrapped) < 2:
        errors.append(
            f"{rel}: sample article must show <div class=\"tags\"> with more than one "
            "<a class=\"tag\"> so a new post can be tagged twice"
        )
    if "every tag page" not in html:
        errors.append(
            f"{rel}: tell the next post to be copied onto every tag page it links"
        )
    return errors


def first_diff(left: str, right: str) -> str:
    left_lines = left.splitlines()
    right_lines = right.splitlines()
    for number, pair in enumerate(zip(left_lines, right_lines), start=1):
        if pair[0] != pair[1]:
            return f"line {number} differs"
    if len(left_lines) != len(right_lines):
        return f"{len(left_lines)} lines vs {len(right_lines)} lines"
    return "contents differ"


def tag_slugs(site: Path) -> set[str]:
    slugs: set[str] = set()
    for path in sorted(site.glob("*/index.html")):
        if path.parent.name == "post":
            continue
        slugs.add(path.parent.name)
    return slugs


def check_repo(root: Path | None = None) -> list[str]:
    root = root or ROOT
    site = root / "site"
    template = root / "templates" / "post.html"
    css_path = site / "css" / "style.css"
    errors = check_css(css_path)
    slugs = tag_slugs(site)
    if not slugs:
        errors.append(f"{_rel(site)}: no tag pages found")
    errors.extend(check_template(template, slugs))

    permalinks: dict[str, tuple[str, list[str]]] = {}
    post_root = site / "post"
    if not post_root.is_dir():
        return errors + [f"{_rel(post_root)}: missing post directory"]

    for path in sorted(post_root.glob("*/index.html")):
        rel = _rel(path)
        html = path.read_text(encoding="utf-8")
        parsed = parse_articles(html)
        sources = article_sources(html)
        if len(parsed) != 1 or len(sources) != 1:
            errors.append(
                f"{rel}: expected one article.post, found {len(parsed)} parsed / {len(sources)} source"
            )
            continue
        article = parsed[0]
        source_id, raw = sources[0]
        if article.id != path.parent.name:
            errors.append(
                f"{rel}: article id {article.id!r} does not match directory {path.parent.name!r}"
            )
        if source_id != article.id:
            errors.append(f"{rel}: parser and source disagree on article id")
        errors.extend(validate_tags(article, rel, slugs))
        hrefs = [tag.href for tag in article.tags if tag.where in {"bare", "wrapper"}]
        permalinks[article.id] = (raw, hrefs)

    def load_page(path: Path) -> dict[str, str]:
        rel = _rel(path)
        html = path.read_text(encoding="utf-8")
        found: dict[str, str] = {}
        for article_id, raw in article_sources(html):
            if not article_id:
                errors.append(f"{rel}: article.post is missing id")
                continue
            if article_id in found:
                errors.append(f"{rel}: duplicate article id {article_id}")
                continue
            found[article_id] = raw
        parsed_ids = [article.id for article in parse_articles(html)]
        if parsed_ids != list(found):
            errors.append(f"{rel}: parsed articles do not match source articles")
        return found

    home = site / "index.html"
    if not home.is_file():
        errors.append(f"{_rel(home)}: missing home feed")
        home_ids: dict[str, str] = {}
    else:
        home_ids = load_page(home)
        for article_id, raw in home_ids.items():
            if article_id not in permalinks:
                errors.append(f"{_rel(home)}: article {article_id} has no permalink under site/post/")
                continue
            canonical, _hrefs = permalinks[article_id]
            if raw != canonical:
                errors.append(
                    f"{_rel(home)}: article {article_id} does not match its permalink "
                    f"({first_diff(canonical, raw)})"
                )
        for article_id in permalinks:
            if article_id not in home_ids:
                errors.append(
                    f"{_rel(home)}: missing article {article_id} (paste it at the top of the home feed)"
                )

    for slug in sorted(slugs):
        page = site / slug / "index.html"
        rel = _rel(page)
        listed = load_page(page)
        href = f"/{slug}/"
        for article_id, (_raw, hrefs) in permalinks.items():
            if href in hrefs and article_id not in listed:
                errors.append(
                    f"{rel}: missing article {article_id}, which links {href}"
                )
        for article_id, raw in listed.items():
            if article_id not in permalinks:
                errors.append(f"{rel}: article {article_id} has no permalink under site/post/")
                continue
            canonical, hrefs = permalinks[article_id]
            if href not in hrefs:
                errors.append(
                    f"{rel}: article {article_id} is on this tag page but does not link {href}"
                )
            if raw != canonical:
                errors.append(
                    f"{rel}: article {article_id} does not match its permalink "
                    f"({first_diff(canonical, raw)})"
                )
    return errors


def main() -> int:
    errors = check_repo(ROOT)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        print(
            f"\n{len(errors)} problem(s). "
            "One tag is <a class=\"tag\" href=\"/family/\">#family</a>. "
            "Several tags go in <div class=\"tags\"> in that same header spot. "
            "Paste the article onto site/index.html and every tag page it lists.",
            file=sys.stderr,
        )
        return 1
    print("OK: each post is on the home feed and every tag page it lists.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
