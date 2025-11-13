import { SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { State } from "signal-utils/async-function";
import { type Meta, type PostList } from "../../shared/types";
import { AppElement } from "../lib/element";
import "./footer.scss";

@customElement("app-footer")
export class FooterElement extends SignalWatcher(AppElement) {
  @property({ attribute: false })
  meta?: State<Promise<Meta>>;

  @property({ attribute: false })
  postList?: PostList;

  render() {
    return html`
      <footer>${this.renderLastUpdated()} ${this.renderNavigation()}</footer>
    `;
  }

  renderLastUpdated() {
    const ms = this.meta?.value?.updated;
    if (!ms) {
      return html`<div></div>`;
    }
    const date = new Date(ms).toISOString();
    return html`
      <div>
        <span>Last updated on</span>
        <sl-format-date
          month="long"
          day="numeric"
          year="numeric"
          date=${date}
        ></sl-format-date>
      </div>
    `;
  }

  renderNavigation() {
    if (!this.postList) {
      return html`<div></div>`;
    }
    return html`
      <div>
        <span
          >${this.postList.currentPageIndex}/${this.postList
            .totalPageCount}</span
        >
        <a href=${this.postList.prev ?? ""}>
          <sl-button ?disabled=${this.postList.prev === undefined}
            >prev</sl-button
          >
        </a>
        <a href=${this.postList.next ?? ""}>
          <sl-button ?disabled=${this.postList.next === undefined}
            >next</sl-button
          >
        </a>
      </div>
    `;
  }
}
