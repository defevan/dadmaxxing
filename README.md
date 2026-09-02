# dadmaxxing

The corner of the internet where I dadpost. Family, climbing, watching, whatever.

Plain static HTML. No CMS, no build, no Shoelace. GitHub Pages serves `site/` at [dad.evanjon.es](https://dad.evanjon.es).

Home is a reverse-chronological feed: time, text, photos, a tag. Paste a new post at the top.

## Local preview

```sh
cd site
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Adding a post

1. Copy `templates/post.html` to `site/post/YYYY-MM-DD-short-slug/index.html` (old posts keep `/post/{id}/`).
2. Fill in the date, the sentence, and the tag. Photos go in `site/media/YYYY-MM-DD-short-slug/` and are referenced as `/media/…`.
3. Copy the `<article class="post">…</article>` block to the **top** of:
   - `site/index.html` (right under `<main>`)
   - the matching tag page (`site/family/`, `site/climbing/`, `site/gaming/`, or `site/anime/`)
4. Optionally bump the “Last updated” line in the footer.
5. Push to `master`.

Paths are root-relative, so the same article pastes as-is.

That’s the whole workflow: edit HTML, commit, push.

## Deploy

Push to `master`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes `site/` to GitHub Pages with CNAME `dad.evanjon.es`. No secrets beyond `GITHUB_TOKEN`. No build step.

Take care,

Evan
