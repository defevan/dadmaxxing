# dadmaxxing

The corner of the internet where I dadpost. Family, climbing, watching, whatever.

This is a plain static site: HTML, CSS, and a tiny theme-toggle script. No Lit, no Vite, no CMS, no Tumblr. GitHub Pages serves the files in `site/` at [dad.evanjon.es](https://dad.evanjon.es).

## Local preview

```sh
cd site
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Adding a post

1. Copy `templates/post.html` to `site/post/YYYY-MM-DD-short-slug/index.html`.
2. Fill in the date, tags, and body. Photos and videos go in `site/media/YYYY-MM-DD-short-slug/` and are referenced from `/media/…` (see the template).
3. Copy the `<article>…</article>` block to the **top** of:
   - `site/index.html`
   - the matching tag page (`site/family/index.html`, `site/climbing/index.html`, `site/gaming/index.html`, or `site/anime/index.html`)
4. Optionally update the “Last updated” footer.
5. Push to `master`.

Paths are root-relative (`/post/…`, `/media/…`), so the article can be copied as-is.

That’s the whole workflow: edit HTML, commit, push.

Existing posts keep their old `/post/{id}/` URLs from the Tumblr days.

## Deploy

Push to `master`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes the `site/` directory to GitHub Pages and sets the CNAME to `dad.evanjon.es`. No secrets beyond `GITHUB_TOKEN`. No build step.

Take care,

Evan
