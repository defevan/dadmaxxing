import { takeUntil } from "rxjs";
import { tsx } from "../lib/tsx";
import { blog } from "../services/blog";
import { UnsubElement } from "../lib/element";
import "./footer.scss";

class FooterElement extends UnsubElement {
  public connectedCallback(): void {
    blog.meta$.pipe(takeUntil(this._unsub)).subscribe((meta) => {
      this.replaceChildren(
        <footer>
          <small>
            Last updated at{" "}
            {meta ? new Date(meta.updated * 1000).toLocaleString() : "..."}
          </small>
          <button click={() => blog.refetch()}>Refresh</button>
        </footer>,
      );
    });
  }
}
customElements.define("app-footer", FooterElement);
