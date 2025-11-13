import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { AppElement } from "../lib/element";
import "./msg.scss";

@customElement("app-msg")
export class MsgElement extends AppElement {
  @property()
  msg?: string;

  @property({ attribute: false })
  delay?: number;

  @state()
  show = false;

  timeoutId?: number | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.timeoutId = setTimeout(() => (this.show = true), this.delay ?? 0);
  }

  disconnectedCallback() {
    clearTimeout(this.timeoutId);
    super.disconnectedCallback();
  }

  render() {
    if (!this.show) {
      return unsafeHTML(`&nbsp;`);
    }
    return html`${this.msg}`;
  }
}
