import { signal, SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AppElement } from "../lib/element";
import { Blog } from "../services/blog";
import { AppRouter } from "../services/router";
import { Theme } from "../services/theme";
import "./app.scss";
import { CardsEvent } from "./post-list";

@customElement("app-root")
export class RootElement extends SignalWatcher(AppElement) {
  theme = new Theme();

  blog = new Blog();

  cards = signal<NodeListOf<Element> | undefined>(undefined);

  handleCards(evt: CardsEvent) {
    this.cards.set(evt.detail);
  }

  router = new AppRouter(this, [
    {
      path: `${import.meta.env.BASE_URL}{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["family", "climbing"]}
          .posts=${this.blog.posts}
          @cards=${this.handleCards}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/family{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["family"]}
          .posts=${this.blog.posts}
          @cards=${this.handleCards}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/climbing{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["climbing"]}
          .posts=${this.blog.posts}
          @cards=${this.handleCards}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/gaming{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["gaming"]}
          .posts=${this.blog.posts}
          @cards=${this.handleCards}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/anime{/}?`,
      render: () => html`
        <app-post-list
          .tags=${["anime"]}
          .posts=${this.blog.posts}
          @cards=${this.handleCards}
        ></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/*`,
      render: () => html`
        <app-post-list
          .tags=${[]}
          .posts=${this.blog.posts}
          @cards=${this.handleCards}
        ></app-post-list>
      `,
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
          <app-header
            .pathname=${pathname}
            .meta=${meta}
            .activeTheme=${activeTheme}
            .toggleTheme=${toggleTheme}
          ></app-header>
          ${this.router.outlet()}
        </div>
        <app-footer .meta=${meta}></app-footer>
      </main>
      <app-scroller
        .pathname=${pathname}
        .fragment=${fragment}
        .cards=${cards}
      ></app-scroller>
      <app-document .meta=${meta}></app-document>
      <app-theme .activeTheme=${activeTheme}></app-theme>
    `;
  }
}
