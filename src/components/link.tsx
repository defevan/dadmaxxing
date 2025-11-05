import { takeUntil } from "rxjs";
import { UnsubElement } from "../lib/element";
import { tsx } from "../lib/tsx";
import { router } from "../services/router";
import "./link.scss";

class LinkElement extends UnsubElement {
  public connectedCallback(): void {
    const handleClick = (evt: Event) => {
      evt.preventDefault();
      const anchor = evt.target as HTMLAnchorElement;
      router.navigate(new URL(anchor.href));
    };

    const href = this.getAttribute("href");
    const label = this.getAttribute("label");

    router.path$.pipe(takeUntil(this._unsub)).subscribe((path) => {
      this.replaceChildren(
        <a
          active={href === path}
          click={handleClick}
          href={`${import.meta.env.BASE_URL}${href}`}
        >
          {label}
        </a>,
      );
    });
  }
}
customElements.define("app-link", LinkElement);
