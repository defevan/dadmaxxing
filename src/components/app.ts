import { provide } from "@lit/context";
import { html, render } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { delayWhen, tap } from "rxjs/operators";
import { homeTags } from "../../shared/types";
import { AppElement } from "../lib/element";
import { mkIdleObservable } from "../lib/idle-observable";
import { observe } from "../lib/observe-decorator";
import { Blog, blogContext } from "../services/blog";
import { AppRouter, routerContext } from "../services/router";
import { Theme, themeContext } from "../services/theme";
import "./app.scss";
import { PostListElement } from "./post-list";

@customElement("app-root")
export class RootElement extends AppElement {
  list = createRef<PostListElement>();

  @provide({ context: routerContext })
  router = new AppRouter(this, [
    {
      path: `${import.meta.env.BASE_URL}{/}?`,
      render: () => html`
        <app-post-list ${ref(this.list)} tags=${homeTags}></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/family{/}?`,
      render: () => html`
        <app-post-list ${ref(this.list)} tags=${["family"]}></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/climbing{/}?`,
      render: () => html`
        <app-post-list ${ref(this.list)} tags=${["climbing"]}></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/gaming{/}?`,
      render: () => html`
        <app-post-list ${ref(this.list)} tags=${["gaming"]}></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/anime{/}?`,
      render: () => html`
        <app-post-list ${ref(this.list)} tags=${["anime"]}></app-post-list>
      `,
    },
    {
      path: `${import.meta.env.BASE_URL}/*`,
      render: () => html`
        <app-post-list ${ref(this.list)} tags=${[]}></app-post-list>
      `,
    },
  ]);

  @provide({ context: themeContext })
  theme = new Theme();

  @provide({ context: blogContext })
  blog = new Blog();

  /**
   * Set document title and favicon when blog meta data has loaded.
   */
  @observe((self) =>
    self.blog.meta$.pipe(
      tap((meta) => {
        document.title = meta.title;
        render(
          html`<link rel="icon" type="image/png" href=${meta.avatar}></link>`,
          document.head,
        );
      }),
    ),
  )
  meta?: unknown;

  @observe((self) =>
    self.router.pathname$.pipe(
      /**
       * WHY?: it seems we cannot immediately scroll to a post on page init
       * with a fragment in the URL. I'm unsure what this is waiting on.
       * PostListElement is initialized by this time.
       */
      delayWhen(() => mkIdleObservable()),
      tap(() => {
        const id = location.hash.replace(/^#/, "");
        self.list.value?.scrollToPost(id);
      }),
    ),
  )
  fragmentScroll?: unknown;

  render() {
    return html`
      <main>
        <div>
          <app-header></app-header>
          ${this.router.outlet()}
        </div>
        <app-footer></app-footer>
      </main>
    `;
  }
}
