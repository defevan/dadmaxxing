import { SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AppElement } from "../lib/element";
import { Blog } from "../services/blog";
import { AppRouter } from "../services/router";
import { Theme } from "../services/theme";
import "./app.scss";

@customElement("app-root")
export class RootElement extends SignalWatcher(AppElement) {
  theme = new Theme();

  blog = new Blog();

  router = new AppRouter(this, [
    {
      path: `{/}?`,
      render: () => html`
        <app-post-list .posts=${this.blog.all}></app-post-list>
      `,
    },
    {
      path: `/family{/}?`,
      render: () => html`
        <app-post-list .posts=${this.blog.family}></app-post-list>
      `,
    },
    {
      path: `/climbing{/}?`,
      render: () => html`
        <app-post-list .posts=${this.blog.climbing}></app-post-list>
      `,
    },
    {
      path: `/gaming{/}?`,
      render: () => html`
        <app-post-list .posts=${this.blog.gaming}></app-post-list>
      `,
    },
    {
      path: `/anime{/}?`,
      render: () => html`
        <app-post-list .posts=${this.blog.anime}></app-post-list>
      `,
    },
    {
      path: `/*`,
      render: () => html`
        <app-post-list .posts=${this.blog.none}></app-post-list>
      `,
    },
  ]);

  render() {
    const { pathname, fragment } = this.router;
    const { meta } = this.blog;
    const { activeTheme, toggle: toggleTheme } = this.theme;
    return html`
      <main>
        <div>
          <app-header
            .pathname=${pathname}
            .meta=${meta}
            .activeTheme=${activeTheme}
            .toggleTheme=${toggleTheme}
          ></app-header>
          <sl-divider></sl-divider>
          <app-scroller .pathname=${pathname} .fragment=${fragment}>
            ${this.router.outlet()}
          </app-scroller>
        </div>
        <sl-divider></sl-divider>
        <app-footer .meta=${meta}></app-footer>
      </main>
      <app-document .meta=${meta}></app-document>
      <app-theme .activeTheme=${activeTheme}></app-theme>
    `;
  }
}
