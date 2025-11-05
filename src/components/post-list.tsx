import type { Immutable } from "immer";
import { combineLatest, takeUntil } from "rxjs";
import { homeTags, type Post } from "../../shared/types";
import { UnsubElement } from "../lib/element";
import { tsx } from "../lib/tsx";
import { blog } from "../services/blog";
import { router } from "../services/router";
import "./post-list.scss";

function renderBody(body: string): HTMLElement {
  const el: HTMLDivElement = <section innerHTML={body} />;
  const medias = [...el.querySelectorAll("figure")].flatMap((fig) => {
    const h = parseFloat(fig.getAttribute("data-orig-height") ?? "");
    const w = parseFloat(fig.getAttribute("data-orig-width") ?? "");
    const medias = [
      ...fig.querySelectorAll("img"),
      ...fig.querySelectorAll("video"),
    ];
    return medias.map((media) => ({ media, h, w }));
  });
  for (const { media, h, w } of medias) {
    if (isNaN(h) || isNaN(w)) {
      console.warn("failed to set img/video aspect ratio");
      continue;
    }
    media.style.aspectRatio = `${w} / ${h}`;
  }
  return el;
}

function renderPost(post: Immutable<Post>, path: string): HTMLElement {
  const date = new Date(post.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const datetime = `${year}-${month}-${day}`;
  /**
   * This is done manually via click handler/anchor tag as navigo
   * has a bug. When pushing new URLs with hashes, extra state changes
   * are also pushed (by navigo), breaking the browser back.
   */
  function onLinkClick(evt: Event) {
    evt.preventDefault();
    window.location.hash = post.id;
  }
  return (
    <li>
      <article tabindex="0" id={post.id}>
        <header>
          <time datetime={datetime}>{date.toLocaleString()}</time>
          <span>
            <a
              click={onLinkClick}
              href={`${import.meta.env.BASE_URL}${path}#${post.id}`}
            >
              Link
            </a>
          </span>
        </header>
        {renderBody(post.body)}
        <footer>
          {post.tags.map((tag) => (
            <app-link label={`#${tag}`} href={`/${tag}`} />
          ))}
        </footer>
      </article>
    </li>
  );
}

class PostListElement extends UnsubElement {
  public connectedCallback(): void {
    combineLatest({ posts: blog.posts$, path: router.path$ })
      .pipe(takeUntil(this._unsub))
      .subscribe(({ posts, path }) => {
        const pathname = path.replace(/^\//, "");
        const filtered = (posts ?? []).filter((post) => {
          if (pathname === "") {
            return post.tags.some((tag) => homeTags.includes(tag));
          }
          return post.tags.some((tag) => tag === pathname);
        });
        if (filtered.length < 1 && Array.isArray(posts)) {
          this.replaceChildren(<div class="empty">(⁎˃ᆺ˂) 404</div>);
          return;
        }
        this.replaceChildren(
          <ul>{filtered.map((post) => renderPost(post, path))}</ul>,
        );
      });
  }
}
customElements.define("app-post-list", PostListElement);
