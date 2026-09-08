# dadmaxxing

Static site for [dad.evanjon.es](https://dad.evanjon.es).

Content lives in `site/`. GitHub Pages publishes on push to `master`.

Runtime (Caddy, Cloudflare Tunnel, log shipping) is owned by [`defevan/infra`](https://github.com/defevan/infra).

New posts start from `templates/post.html`. Every content `<img>` / `<video>` needs `style="aspect-ratio: W / H"` matching the file (the same CSS pattern the imported posts used). Every content `<img>` is also wrapped in `<a href="same-src">` so a click opens the original. Display size stays fluid (`width: 100%; height: auto` in `site/css/style.css`). CI runs `python3 scripts/check_img_aspect_ratio.py`; pass `--fix` to fill ratios and wraps from local files.
