import { flow } from "@lit-labs/virtualizer/layouts/flow.js";
import {
  virtualize,
  virtualizerRef,
  type VirtualizerHostElement,
} from "@lit-labs/virtualizer/virtualize.js";
import { consume } from "@lit/context";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { tap } from "rxjs/operators";
import { type Post } from "../../shared/types";
import { AppElement } from "../lib/element";
import { mkMutationObservable } from "../lib/mutation-observable";
import { observe } from "../lib/observe-decorator";
import { Blog, blogContext } from "../services/blog";
import { AppRouter, routerContext } from "../services/router";
import "./post-list.scss";

@customElement("app-post-body")
export class PostBodyElement extends AppElement {
  @property()
  body: string = "";

  /**
   * Set aspect-ratio on content img/video tags.
   */
  @observe((self) =>
    mkMutationObservable(self).pipe(
      tap(() => {
        const medias = [...self.querySelectorAll("figure")].flatMap((fig) => {
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
      }),
    ),
  )
  node?: unknown;

  render() {
    return html` <section>${unsafeHTML(this.body)}</section> `;
  }
}

@customElement("app-post-list")
export class PostListElement extends AppElement {
  /**
   * set by virtualize directive
   */
  [virtualizerRef]?: VirtualizerHostElement[typeof virtualizerRef];

  @consume({ context: blogContext })
  blog!: Blog;

  @consume({ context: routerContext })
  router!: AppRouter;

  @observe((self) => self.blog.posts$)
  posts?: Array<Post>;

  @property()
  tags: Array<string> = [];

  #filtered(): Array<Post> {
    if (!this.posts) {
      return [];
    }
    return this.posts.filter((p) =>
      p.tags.some((tag) => this.tags.includes(tag)),
    );
  }

  scrollToPost(id: string): void {
    const idx = this.#filtered().findIndex((post) => post.id === id);
    this[virtualizerRef]?.element(idx)?.scrollIntoView();
  }

  render() {
    const posts = this.#filtered();
    if (posts.length < 1 && Array.isArray(this.posts)) {
      return html` <div class="empty">(⁎˃ᆺ˂) 404</div> `;
    }
    return virtualize({
      layout: flow({ direction: "vertical" }),
      items: posts,
      keyFunction: (post) => post.id,
      renderItem: (post) => this.#renderPost(post),
    });
  }

  #renderPost(post: Post) {
    const date = new Date(post.date);
    const url = `${location.origin}${location.pathname}#${post.id}`;
    return html`
      <div class="card-container">
        <sl-card id=${post.id} tabindex="0">
          <div slot="header">
            <sl-format-date
              month="long"
              day="numeric"
              year="numeric"
              date=${date.toISOString()}
            ></sl-format-date>
            <a href=${`#${post.id}`}>
              <sl-copy-button value=${url}></sl-copy-button>
            </a>
          </div>
          <slot>
            <app-post-body .body=${post.body}></app-post-body>
          </slot>
          <div slot="footer">
            ${post.tags.map((tag) => this.#renderTag(tag))}
          </div>
        </sl-card>
      </div>
    `;
  }

  #renderTag(tag: string) {
    const href = `${import.meta.env.BASE_URL}/${tag}`;
    const text = `#${tag}`;
    return html`
      <a href=${href}>
        <sl-tag pill>${text}</sl-tag>
      </a>
    `;
  }
}
