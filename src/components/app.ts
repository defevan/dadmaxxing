import { provide } from "@lit/context";
import { html, render } from "lit";
import { customElement } from "lit/decorators.js";
import { tap } from "rxjs/operators";
import { homeTags } from "../../shared/types";
import { AppElement } from "../lib/element";
import { observe } from "../lib/observe-decorator";
import { Blog, blogContext } from "../services/blog";
import { AppRouter, routerContext } from "../services/router";
import "./app.scss";

@customElement("app-root")
export class RootElement extends AppElement {
  @provide({ context: routerContext })
  router = new AppRouter(this, [
    {
      path: `${import.meta.env.BASE_URL}{/}?`,
      render: () => html`<app-post-list tags=${homeTags}></app-post-list>`,
    },
    {
      path: `${import.meta.env.BASE_URL}/family{/}?`,
      render: () => html`<app-post-list tags=${["family"]}></app-post-list>`,
    },
    {
      path: `${import.meta.env.BASE_URL}/climbing{/}?`,
      render: () => html`<app-post-list tags=${["climbing"]}></app-post-list>`,
    },
    {
      path: `${import.meta.env.BASE_URL}/gaming{/}?`,
      render: () => html`<app-post-list tags=${["gaming"]}></app-post-list>`,
    },
    {
      path: `${import.meta.env.BASE_URL}/anime{/}?`,
      render: () => html`<app-post-list tags=${["anime"]}></app-post-list>`,
    },
    {
      path: `${import.meta.env.BASE_URL}/*`,
      render: () => html`<app-post-list tags=${[]}></app-post-list>`,
    },
  ]);

  @provide({ context: blogContext })
  blog = new Blog();

  /**
   * Fetch blog data.
   */
  @observe((self) => self.blog.load$)
  load?: unknown;

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
      tap(() => {
        const id = location.hash.replace(/^#/, "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          // TODO: reconsider this.
          window.scrollTo(0, 0);
        }
      }),
    ),
  )
  navigation?: unknown;

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
