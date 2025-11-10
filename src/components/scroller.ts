import { Signal, SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AppElement } from "../lib/element";
import "./scroller.scss";

export function renderScroller({
  pathname,
  fragment,
  cards,
}: {
  pathname: Signal.State<string | undefined>;
  fragment: Signal.State<string | undefined>;
  cards: Signal.State<NodeListOf<Element> | undefined>;
}) {
  return html`
    <app-scroller
      .pathname=${pathname}
      .fragment=${fragment}
      .cards=${cards}
    ></app-scroller>
  `;
}

@customElement("app-scroller")
export class ScrollerElement extends SignalWatcher(AppElement) {
  /**
   * NOTE: unused but it's desired this component runs updated()
   * when this value is changed.
   */
  @property()
  pathname?: Signal.State<string | undefined>;

  @property()
  fragment?: Signal.State<string | undefined>;

  @property()
  cards?: Signal.State<NodeListOf<Element> | undefined>;

  async updated() {
    const fragment = this.fragment?.get();
    const cards = this.cards?.get();
    if (!cards || cards.length < 1) {
      return;
    }
    const card = Array.from(cards).find((c) => c.id === fragment);
    await new Promise(requestAnimationFrame);
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
}
