import { Signal, SignalWatcher } from "@lit-labs/signals";
import { customElement, property } from "lit/decorators.js";
import { AppElement } from "../lib/element";
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

  @property({ attribute: false })
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
