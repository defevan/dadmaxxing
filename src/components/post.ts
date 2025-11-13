import { SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { State } from "signal-utils/async-function";
import { type Post } from "../../shared/types";
import { AppElement } from "../lib/element";
import "./post.scss";

@customElement("app-post")
export class PostElement extends SignalWatcher(AppElement) {
  @property({ attribute: false })
  post?: Post | State<Promise<Post>>;

  render() {
    if (this.post && !(this.post instanceof State)) {
      return this.renderPost(this.post);
    }
    if (this.post?.state === "RESOLVED" && this.post.value) {
      return this.renderPost(this.post.value);
    }
    if (this.post?.state === "REJECTED") {
      return html`
        <app-msg .msg=${`¯\\_(ツ)_/¯ 404 i couldn't find the thing`}></app-msg>
      `;
    }
    if (this.post?.state === "PENDING") {
      return html`
        <app-msg .delay=${500} .msg=${`(._. ) looking for the thing`}></app-msg>
      `;
    }
    return html`
      <app-msg .msg=${`(x_x) 500 something went horribly wrong`}></app-msg>
    `;
  }

  renderPost(post: Post) {
    const date = new Date(post.date);
    const url = `${location.origin}/post/${post.id}`;
    return html`
      <div class="card-container">
        <div id=${post.id} class="card" tabindex="0">
          <div class="card-header">
            <sl-format-date
              month="long"
              day="numeric"
              year="numeric"
              date=${date.toISOString()}
            ></sl-format-date>
            <sl-copy-button
              value=${url}
              copy-label="copy post link"
              success-label="post link copied"
            ></sl-copy-button>
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
        const href = `/${tag}`;
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
