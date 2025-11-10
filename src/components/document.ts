import { SignalWatcher } from "@lit-labs/signals";
import { html, render } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { State } from "signal-utils/async-function";
import type { Meta } from "../../shared/types";
import { AppElement } from "../lib/element";
import "./document.scss";

export function renderDocument({ meta }: { meta: State<Promise<Meta>> }) {
  return html`<app-document .meta=${meta}></app-document>`;
}

@customElement("app-document")
export class DocumentElement extends SignalWatcher(AppElement) {
  @property()
  meta?: State<Promise<Meta>>;

  updated() {
    switch (this.meta?.state) {
      case "REJECTED": {
        document.title = "error";
        return;
      }
      case "RESOLVED": {
        document.title = this.meta.value?.title ?? "";
        render(
          html`<link rel="icon" type="image/png" href=${this.meta.value?.avatar}></link>`,
          document.head,
        );
        return;
      }
    }
  }
}
