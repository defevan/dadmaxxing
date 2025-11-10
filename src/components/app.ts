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
      path: `${import.meta.env.BASE_URL}{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["family", "climbing"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/family{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["family"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/climbing{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["climbing"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/gaming{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["gaming"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/anime{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["anime"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/*`,
      render: () => html`
        <app-post-list .tags=${[]} .posts=${this.blog.posts}></app-post-list>
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
          <app-scroller .pathname=${pathname} .fragment=${fragment}>
            ${this.router.outlet()}
          </app-scroller>
        </div>
        <app-footer .meta=${meta}></app-footer>
      </main>
      <app-document .meta=${meta}></app-document>
      <app-theme .activeTheme=${activeTheme}></app-theme>
    `;
  }
}
