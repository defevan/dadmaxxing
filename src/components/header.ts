import { SignalWatcher, type Signal } from "@lit-labs/signals";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { State } from "signal-utils/async-function";
import type { Meta } from "../../shared/types";
import { AppElement } from "../lib/element";
import { type ThemeValue } from "../services/theme";
import "./header.scss";

type Link = {
  label: string;
  href: string;
  active: (pathname: string) => boolean;
};

const links: Link[] = [
  {
    label: `Home`,
    href: `/`,
    active: (pathname) => pathname.length < 1 || pathname.startsWith("/page"),
  },
  {
    label: `Family`,
    href: `/family`,
    active: (pathname) => pathname.startsWith("/family"),
  },
  {
    label: `Climbing`,
    href: `/climbing`,
    active: (pathname) => pathname.startsWith("/climbing"),
  },
  {
    label: `Gaming`,
    href: `/gaming`,
    active: (pathname) => pathname.startsWith("/gaming"),
  },
  {
    label: `Anime`,
    href: `/anime`,
    active: (pathname) => pathname.startsWith("/anime"),
  },
  {
    label: `Source`,
    href: `https://github.com/defevan/dadmaxxing`,
    active: () => false,
  },
];

@customElement("app-header")
export class HeaderElement extends SignalWatcher(AppElement) {
  @property({ attribute: false })
  pathname?: Signal.State<string | undefined>;

  @property({ attribute: false })
  meta?: State<Promise<Meta>>;

  @property({ attribute: false })
  activeTheme?: Signal.State<ThemeValue>;

  @property({ attribute: false })
  toggleTheme?: () => void;

  typographyElements() {
    switch (this.meta?.state) {
      case "REJECTED": {
        const h1 = html`<h1>error</h1>`;
        const p = html`<p>uh, big issue, failed to get the blog meta data</p>`;
        return { h1, p };
      }
      default: {
        const h1 = this.meta?.value
          ? html`<h1>${this.meta.value.title}</h1>`
          : html`<h1>${unsafeHTML("&nbsp;")}</h1>`;
        const p = this.meta?.value
          ? html`<p>${this.meta.value.description}</p>`
          : html`<p>${unsafeHTML("&nbsp;")}</p>`;
        return { h1, p };
      }
    }
  }

  render() {
    const { h1, p } = this.typographyElements();
    const navLinks = repeat(
      links,
      (link) => link.href,
      (link) => this.renderLink(link),
    );
    return html`
      <header>
        <div>${h1} ${p}</div>
        <div>
          <nav>${navLinks}</nav>
          <div class="switch-container">
            <sl-switch
              ?checked=${this.activeTheme?.get() === "dark"}
              @sl-change=${() => this.toggleTheme?.()}
              >dark mode</sl-switch
            >
          </div>
        </div>
      </header>
    `;
  }

  renderLink({ href, label, active }: Link) {
    if (href.includes("https://")) {
      return html`<a href=${href}>${label}</a>`;
    }
    return html`
      <a href=${href} ?active=${active(this.pathname?.get() ?? "")}>
        ${label}
      </a>
    `;
  }
}
