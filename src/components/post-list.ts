import { SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { State } from "signal-utils/async-function";
import { type Post } from "../../shared/types";
import { AppElement } from "../lib/element";
import "./post-list.scss";

export class CardsEvent extends CustomEvent<NodeListOf<Element>> {
  constructor(detail: NodeListOf<Element>) {
    super("cards", { detail });
  }
}

@customElement("app-post-list")
export class PostListElement extends SignalWatcher(AppElement) {
  @property()
  tags?: Array<string>;

  @property()
  posts?: State<Promise<Post[]>>;

  updated() {
    const cards = this.querySelectorAll("div.card");
    this.dispatchEvent(new CardsEvent(cards));
  }

  render() {
    switch (this.posts?.state) {
      case "RESOLVED": {
        const posts = this.posts.value ?? [];
        const filtered = posts.filter((p) =>
          p.tags.some((t) => this.tags?.includes(t)),
        );
        if (filtered.length < 1) {
          return html`
            <div class="msg">¯\\_(ツ)_/¯ 404 i couldn't find the thing</div>
          `;
        }
        const list = repeat(
          filtered,
          (post) => post.id,
          (post) => this.renderPost(post),
        );
        return html`
          ${list}
          <sl-divider></sl-divider>
        `;
      }
      case "REJECTED": {
        return html`
          <div class="msg">(x_x) 500 something went horribly wrong</div>
        `;
      }
      default: {
        // return html` <div class="msg">(._. ) looking for the thing</div> `;
        return null;
      }
    }
  }

  renderPost(post: Post) {
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
          <div class="card-body">${this.renderPostBody(post.body)}</div>
          <div class="card-footer">${this.renderTags(post.tags)}</div>
        </div>
      </div>
    `;
  }

  renderTags(tags: Array<string>) {
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

  renderPostBody(body: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, "text/html");
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
