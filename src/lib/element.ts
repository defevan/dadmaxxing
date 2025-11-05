import { LitElement } from "lit";

export class AppElement extends LitElement {
  /**
   * Disable shadow DOM.
   */
  createRenderRoot() {
    return this;
  }
}
