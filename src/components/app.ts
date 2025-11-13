import { SignalWatcher } from "@lit-labs/signals";
import { constant, either, object, optional } from "decoders";
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
      pattern: new URLPattern({
        pathname: "{/:tag}?{/}*",
      }),
      render: (props) => {
        const decoder = object({
          tag: optional(
            either(
              constant("all"),
              constant("family"),
              constant("climbing"),
              constant("gaming"),
              constant("anime"),
            ),
          ),
        });
        const decoded = decoder.value(props);
        const tag = decoded?.tag;
        const posts = this.blog.posts[tag ?? "all"];
        return html`<app-post-list .posts=${posts}></app-post-list>`;
      },
    },
    {
      pattern: new URLPattern({
        pathname: "/*",
      }),
      render: () => {
        return html`<app-post-list .posts=${this.blog.none}></app-post-list>`;
      },
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
