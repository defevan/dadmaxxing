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
    const updated = this.meta
      ? new Date(this.meta.updated * 1000).toLocaleString()
      : "...";
    return html`
      <footer>
        <small> Last updated at ${updated} </small>
      </footer>
    `;
  }
}
