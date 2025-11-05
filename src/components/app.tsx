import { delay, distinctUntilChanged, Observable, takeUntil } from "rxjs";
import { UnsubElement } from "../lib/element";
import { tsx } from "../lib/tsx";
import "./app.scss";

class AppElement extends UnsubElement {
  public connectedCallback(): void {
    this.replaceChildren(
      <main>
        <div>
          <app-header></app-header>
          <app-post-list></app-post-list>
        </div>
        <app-footer></app-footer>
      </main>,
    );

    const fragmentElement$ = new Observable<HTMLElement | null>((obs) => {
      function checkHash() {
        const fragment = window.location.hash.replace(/^#/, "");
        const el = document.getElementById(fragment);
        obs.next(el);
      }
      const observer = new MutationObserver(checkHash);
      window.addEventListener("hashchange", checkHash);
      observer.observe(this, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
        window.removeEventListener("hashchange", checkHash);
      };
    });

    fragmentElement$
      .pipe(distinctUntilChanged(), delay(1), takeUntil(this._unsub))
      .subscribe({
        next: (el) => {
          el?.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
          });
        },
        error: (err) =>
          console.warn("failed to scroll to fragment element", err),
      });
  }
}
customElements.define("app-root", AppElement);
