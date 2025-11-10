import { html, Signal, SignalWatcher } from "@lit-labs/signals";
import { customElement, property, state } from "lit/decorators.js";
import { AppElement } from "../lib/element";
import { CardsEvent } from "./post-list";
import "./scroller.scss";

@customElement("app-scroller")
export class ScrollerElement extends SignalWatcher(AppElement) {
  /**
   * NOTE: unused but it's desired this component runs updated()
   * when this value is changed.
   */
  @property({ attribute: false })
  pathname?: Signal.State<string | undefined>;

  @property({ attribute: false })
  fragment?: Signal.State<string | undefined>;

  @state()
  cards?: NodeListOf<Element>;

  handleCards(evt: Event) {
    if (!(evt instanceof CardsEvent)) {
      return;
    }
    this.cards = evt.detail;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("cards", this.handleCards);
  }

  disconnectedCallback() {
    this.removeEventListener("cards", this.handleCards);
    super.disconnectedCallback();
  }

  async updated() {
    const fragment = this.fragment?.get();
    const cards = this.cards;
    if (!cards || cards.length < 1) {
      return;
    }
    const card = Array.from(cards).find((c) => c.id === fragment);
    await new Promise((r) => requestIdleCallback(r));
    if (card) {
      card.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "nearest",
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
