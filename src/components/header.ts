import { consume } from "@lit/context";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import type { Meta } from "../../shared/types";
import { AppElement } from "../lib/element";
import { observe } from "../lib/observe-decorator";
import { Blog, blogContext } from "../services/blog";
import { AppRouter, routerContext } from "../services/router";
import "./header.scss";

type Link = {
  label: string;
  href: string;
};

const links: Array<Link> = [
  { label: `Home`, href: `${import.meta.env.BASE_URL}` },
  { label: `Family`, href: `${import.meta.env.BASE_URL}/family` },
  { label: `Climbing`, href: `${import.meta.env.BASE_URL}/climbing` },
  { label: `Gaming`, href: `${import.meta.env.BASE_URL}/gaming` },
  { label: `Anime`, href: `${import.meta.env.BASE_URL}/anime` },
  { label: `Source`, href: `https://github.com/defevan/dadmaxxing` },
];

@customElement("app-header")
export class HeaderElement extends AppElement {
  @consume({ context: blogContext })
  blog!: Blog;

  @consume({ context: routerContext })
  router!: AppRouter;

  @observe((self) => self.blog.meta$)
  meta?: Meta;

  @observe((self) => self.router.pathname$)
  pathname?: string;

  render() {
    const p = this.meta
      ? html`<p>${this.meta.description}</p>`
      : html`<p .innerHTML=${"&nbsp;"}></p>`;
    return html`
      <header>
        <div>
          <h1>${this.meta?.title ?? "..."}</h1>
          ${p}
        </div>
        <nav>${links.map((link) => this.renderLink(link))}</nav>
      </header>
    `;
  }

  renderLink({ href, label }: Link) {
    if (href.includes("https://")) {
      return html`<a href=${href}>${label}</a>`;
    }
    const active = this.pathname === href;
    return html`<a href=${href} active=${active}>${label}</a>`;
  }
}
