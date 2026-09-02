# dadmaxxing

The corner of the internet where I dadpost. Family, climbing, watching, whatever.

This is a plain static site: HTML and CSS. No Lit, no Vite, no CMS, no Tumblr, no theme toggle. GitHub Pages serves the files in `site/` at [dad.evanjon.es](https://dad.evanjon.es).

The home page is a photo album: newest memory as a spread, then a mosaic of the rest. Room pages (`/family/`, `/climbing/`, `/gaming/`, `/anime/`) are filtered mosaics. Permalinks keep the old `/post/{id}/` URLs from the Tumblr days.

## Local preview

```sh
cd site
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Adding a post

1. Copy `templates/post.html` to `site/post/YYYY-MM-DD-short-slug/index.html`.
2. Fill in the date, room, and body. Photos and videos go in `site/media/YYYY-MM-DD-short-slug/` and are referenced from `/media/…`.
3. Copy the tile from `templates/tile.html` to the **top** of:
   - the home mosaic in `site/index.html` (`<ol class="mosaic">`)
   - the matching room page (`site/family/index.html`, `site/climbing/index.html`, `site/gaming/index.html`, or `site/anime/index.html`)
4. If this is the newest memory, also replace the home-page `<section class="spread">` photos and caption.
5. Optionally update the “Last updated” line in the colophon.
6. Push to `master`.

Paths are root-relative (`/post/…`, `/media/…`).

That’s the whole workflow: edit HTML, commit, push.

## Deploy

Push to `master`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes the `site/` directory to GitHub Pages and sets the CNAME to `dad.evanjon.es`. No secrets beyond `GITHUB_TOKEN`. No build step.

Take care,

Evan
