import { SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { State } from "signal-utils/async-function";
import { type Meta } from "../../shared/types";
import { AppElement } from "../lib/element";
import "./footer.scss";

export function renderFooter({ meta }: { meta: State<Promise<Meta>> }) {
  return html` <app-footer .meta=${meta}></app-footer> `;
}

@customElement("app-footer")
export class FooterElement extends SignalWatcher(AppElement) {
  @property()
  meta?: State<Promise<Meta>>;

  render() {
    switch (this.meta?.state) {
      case "RESOLVED": {
        const seconds = this.meta?.value?.updated ?? 0;
        const date = new Date(seconds * 1000).toISOString();
        return html`
          <footer>
            <div>
              <span>Last updated on</span>
              <sl-format-date
                month="long"
                day="numeric"
                year="numeric"
                date=${date}
              ></sl-format-date>
            </div>
            <div>
              <sl-button @click=${() => window.scrollTo(0, 0)}
                >scroll up</sl-button
              >
            </div>
          </footer>
        `;
      }
      default: {
        return html`
          <footer>
            <div></div>
            <div>
              <sl-button @click=${() => window.scrollTo(0, 0)}
                >scroll up</sl-button
              >
            </div>
          </footer>
        `;
      }
    }
  }
}
