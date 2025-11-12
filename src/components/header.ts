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

const links = [
  { label: `Home`, href: `/` },
  { label: `Family`, href: `/family` },
  { label: `Climbing`, href: `/climbing` },
  { label: `Gaming`, href: `/gaming` },
  { label: `Anime`, href: `/anime` },
  { label: `Source`, href: `https://github.com/defevan/dadmaxxing` },
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

  renderLink({ href, label }: (typeof links)[number]) {
    if (href.includes("https://")) {
      return html`<a href=${href}>${label}</a>`;
    }
    const active = (this.pathname?.get() || "/") === href;
    return html`<a href=${href} ?active=${active}>${label}</a>`;
  }
}
