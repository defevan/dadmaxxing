import { Router as LitRouter } from "@lit-labs/router";
import { signal } from "@lit-labs/signals";

export class AppRouter extends LitRouter {
  pathname = signal<string | undefined>(undefined);

  async goto(p: string): Promise<void> {
    const pathname = p.replace(/\/$/, "");
    await super.goto(pathname);
    this.pathname.set(pathname);
    window.scrollTo(0, 0);
  }
}
