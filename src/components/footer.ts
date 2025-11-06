import { consume } from "@lit/context";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { type Meta } from "../../shared/types";
import { AppElement } from "../lib/element";
import { observe } from "../lib/observe-decorator";
import { Blog, blogContext } from "../services/blog";
import "./footer.scss";

@customElement("app-footer")
export class FooterElement extends AppElement {
  @consume({ context: blogContext })
  blog!: Blog;

  @observe((self) => self.blog.meta$)
  meta?: Meta;

  render() {
    const seconds = this.meta?.updated ?? 0;
    const date = new Date(seconds * 1000).toISOString();
    return html`
      <footer>
        <div>
          <span>Last updated on</span>
          <sl-format-date
            month="long"
            day="numeric"
            year="numeric"
            date=${date}
          ></sl-format-date>
        </div>
        <div>
          <sl-button @click=${() => window.scrollTo(0, 0)}>scroll up</sl-button>
        </div>
      </footer>
    `;
  }
}
