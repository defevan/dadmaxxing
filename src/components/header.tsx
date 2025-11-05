import { takeUntil } from "rxjs";
import { UnsubElement } from "../lib/element";
import { tsx } from "../lib/tsx";
import { blog } from "../services/blog";
import "./header.scss";

class HeaderElement extends UnsubElement {
  public connectedCallback(): void {
    blog.meta$.pipe(takeUntil(this._unsub)).subscribe((meta) => {
      const links = [
        { label: "Home", href: "/" },
        { label: "Family", href: "/family" },
        { label: "Climbing", href: "/climbing" },
        { label: "Gaming", href: "/gaming" },
        { label: "Anime", href: "/anime" },
        { label: "Source", href: "https://github.com/defevan/dadmaxxing" },
      ];
      this.replaceChildren(
        <header>
          <div>
            <h1>{meta?.title ?? "..."}</h1>
            {meta ? <p>{meta.description}</p> : <p innerHTML="&nbsp;"></p>}
          </div>
          <nav>
            {links.map((link) => {
              if (link.href.includes("https://")) {
                return <a href={link.href}>{link.label}</a>;
              }
              return <app-link {...link} />;
            })}
          </nav>
        </header>,
      );
    });
  }
}
customElements.define("app-header", HeaderElement);
