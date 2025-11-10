import { signal, SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { homeTags } from "../../shared/types";
import { AppElement } from "../lib/element";
import { Blog } from "../services/blog";
import { AppRouter } from "../services/router";
import { Theme } from "../services/theme";
import "./app.scss";
import { renderDocument } from "./document";
import { renderFooter } from "./footer";
import { renderHeader } from "./header";
import { renderPostList } from "./post-list";
import { renderScroller } from "./scroller";
import { renderTheme } from "./theme";

@customElement("app-root")
export class RootElement extends SignalWatcher(AppElement) {
  theme = new Theme();

  blog = new Blog();

  cards = signal<NodeListOf<Element> | undefined>(undefined);

  router = new AppRouter(this, [
    {
      path: `${import.meta.env.BASE_URL}{/}?`,
      render: () =>
        renderPostList({
          tags: homeTags,
          posts: this.blog.posts,
          handleCards: (evt) => this.cards.set(evt.detail),
        }),
    },
    {
      path: `${import.meta.env.BASE_URL}/family{/}?`,
      render: () =>
        renderPostList({
          tags: ["family"],
          posts: this.blog.posts,
          handleCards: (evt) => this.cards.set(evt.detail),
        }),
    },
    {
      path: `${import.meta.env.BASE_URL}/climbing{/}?`,
      render: () =>
        renderPostList({
          tags: ["climbing"],
          posts: this.blog.posts,
          handleCards: (evt) => this.cards.set(evt.detail),
        }),
    },
    {
      path: `${import.meta.env.BASE_URL}/gaming{/}?`,
      render: () =>
        renderPostList({
          tags: ["gaming"],
          posts: this.blog.posts,
          handleCards: (evt) => this.cards.set(evt.detail),
        }),
    },
    {
      path: `${import.meta.env.BASE_URL}/anime{/}?`,
      render: () =>
        renderPostList({
          tags: ["anime"],
          posts: this.blog.posts,
          handleCards: (evt) => this.cards.set(evt.detail),
        }),
    },
    {
      path: `${import.meta.env.BASE_URL}/*`,
      render: () =>
        renderPostList({
          tags: [],
          posts: this.blog.posts,
          handleCards: (evt) => this.cards.set(evt.detail),
        }),
    },
  ]);

  render() {
    const { pathname, fragment } = this.router;
    const { meta } = this.blog;
    const { activeTheme, toggle: toggleTheme } = this.theme;
    const { cards } = this;
    return html`
      <main>
        <div>
          ${renderHeader({ pathname, meta, activeTheme, toggleTheme })}
          ${this.router.outlet()}
        </div>
        ${renderFooter({ meta })}
      </main>
      ${renderScroller({ pathname, fragment, cards })}
      ${renderDocument({ meta })} ${renderTheme({ activeTheme })}
    `;
  }
}
