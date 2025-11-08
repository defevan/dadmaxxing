import { consume } from "@lit/context";
import { html } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { EMPTY, type Observable } from "rxjs";
import { type Post } from "../../shared/types";
import { AppElement } from "../lib/element";
import { observe } from "../lib/observe-decorator";
import { AppRouter, routerContext } from "../services/router";
import "./post-list.scss";

@customElement("app-post-body")
export class PostBodyElement extends AppElement {
  @property()
  body: string = "";

  render() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.body, "text/html");
    for (const fig of doc.querySelectorAll("figure")) {
      const h = parseFloat(fig.getAttribute("data-orig-height") ?? "");
      const w = parseFloat(fig.getAttribute("data-orig-width") ?? "");
      if (isNaN(h) || isNaN(w)) {
        console.warn("failed to set img/video aspect ratio");
        continue;
      }
      const medias = [
        ...fig.querySelectorAll("img"),
        ...fig.querySelectorAll("video"),
      ];
      for (const media of medias) {
        media.style.aspectRatio = `${w} / ${h}`;
        media.style.backgroundColor = "rgba(128, 128, 128, 0.1)";
      }
    }
    return unsafeHTML(doc.body.innerHTML);
  }
}

@customElement("app-post-list")
export class PostListElement extends AppElement {
  @consume({ context: routerContext })
  router!: AppRouter;

  @property()
  posts$: Observable<Array<Post>> = EMPTY;

  @observe((self) => self.posts$)
  posts?: Array<Post>;

  @queryAll("div[id].card")
  cards?: NodeListOf<HTMLDivElement>;

  scrollToPost(id: string): void {
    const idx = this.posts?.findIndex((post) => post.id === id) ?? -1;
    this.cards?.item(idx).scrollIntoView();
  }

  render() {
    if (!this.posts) {
      // Loading.
      return;
    }
    if (this.posts.length < 1 && Array.isArray(this.posts)) {
      return html` <div class="empty">(⁎˃ᆺ˂) 404</div> `;
    }
    const list = repeat(
      this.posts,
      (post) => post.id,
      (post) => renderPost(post),
    );
    return html`
      ${list}
      <sl-divider></sl-divider>
    `;
  }
}

function renderPost(post: Post) {
  const date = new Date(post.date);
  const url = `${location.origin}${location.pathname}#${post.id}`;
  return html`
    <sl-divider></sl-divider>
    <div class="card-container">
      <div id=${post.id} class="card" tabindex="0">
        <div class="card-header">
          <sl-format-date
            month="long"
            day="numeric"
            year="numeric"
            date=${date.toISOString()}
          ></sl-format-date>
          <a href=${`#${post.id}`} class="copy-link">
            <sl-copy-button value=${url}></sl-copy-button>
          </a>
        </div>
        <div class="card-body">
          <app-post-body .body=${post.body}></app-post-body>
        </div>
        <div class="card-footer">${renderTags(post.tags)}</div>
      </div>
    </div>
  `;
}

function renderTags(tags: Array<string>) {
  return repeat(
    tags,
    (tag) => tag,
    (tag) => {
      const href = `${import.meta.env.BASE_URL}/${tag}`;
      const text = `#${tag}`;
      return html`
        <a href=${href}>
          <sl-tag pill>${text}</sl-tag>
        </a>
      `;
    },
  );
}
