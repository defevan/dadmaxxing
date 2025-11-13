import { SignalWatcher } from "@lit-labs/signals";
import { object, optional, string } from "decoders";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { tagsDecoder } from "../../shared/types";
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
    /**
     * HOME LIST PAGE
     */
    {
      pattern: new URLPattern({
        pathname: "{/page/:cursor}?{/}?",
      }),
      render: (props) => {
        const decoder = object({
          cursor: optional(string),
        });
        const decoded = decoder.verify(props);
        const cursor = decoded?.cursor;
        const posts = this.blog.posts("all", cursor);
        return html`
          <app-post-list
            .meta=${this.blog.meta}
            .posts=${posts}
          ></app-post-list>
        `;
      },
    },
    /**
     * TAG LIST PAGE
     */
    {
      pattern: new URLPattern({
        pathname: "/:tag(family|climbing|gaming|anime){/page/:cursor}?{/}?",
      }),
      render: (props) => {
        const decoder = object({
          tag: tagsDecoder,
          cursor: optional(string),
        });
        const decoded = decoder.verify(props);
        const tag = decoded?.tag;
        const cursor = decoded?.cursor;
        const posts = this.blog.posts(tag, cursor);
        return html`
          <app-post-list
            .meta=${this.blog.meta}
            .posts=${posts}
          ></app-post-list>
        `;
      },
    },
    /**
     * POST PAGE
     */
    {
      pattern: new URLPattern({
        pathname: "/post/{:post}{/}?",
      }),
      render: (props) => {
        const decoder = object({ post: string });
        const decoded = decoder.verify(props);
        const post = this.blog.post(decoded.post);
        return html`
          <app-post .post=${post}></app-post>
          <sl-divider></sl-divider>
          <app-footer .meta=${this.blog.meta}></app-footer>
        `;
      },
    },
    /**
     * NOT FOUND PAGE
     */
    {
      pattern: new URLPattern({
        pathname: "/*",
      }),
      render: () => {
        return html`
          <app-msg
            .msg=${`¯\\_(ツ)_/¯ 404 i couldn't find the thing`}
          ></app-msg>
          <sl-divider></sl-divider>
          <app-footer .meta=${this.blog.meta}></app-footer>
        `;
      },
    },
  ]);

  render() {
    const { pathname } = this.router;
    const { meta } = this.blog;
    const { activeTheme, toggle: toggleTheme } = this.theme;
    return html`
      <main>
        <app-header
          .pathname=${pathname}
          .meta=${meta}
          .activeTheme=${activeTheme}
          .toggleTheme=${toggleTheme}
        ></app-header>
        <sl-divider></sl-divider>
        ${this.router.outlet()}
      </main>
      <app-document .meta=${meta}></app-document>
      <app-theme .activeTheme=${activeTheme}></app-theme>
    `;
  }
}
