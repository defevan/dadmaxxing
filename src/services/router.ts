import { Router as LitRouter } from "@lit-labs/router";
import { createContext } from "@lit/context";
import { Subject } from "rxjs";

export const routerContext = createContext<AppRouter>("router");

export class AppRouter extends LitRouter {
  readonly #pathname = new Subject<string>();
  readonly pathname$ = this.#pathname.asObservable();

  async goto(p: string): Promise<void> {
    const pathname = p.replace(/\/$/, "");
    await super.goto(pathname);
    this.#pathname.next(pathname);
  }
}
