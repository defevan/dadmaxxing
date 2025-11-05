import { Router as LitRouter } from "@lit-labs/router";
import { createContext } from "@lit/context";
import { Observable, Subject } from "rxjs";
import { map, switchAll } from "rxjs/operators";
import { mkIdleObservable } from "../lib/idle-observable";

export const routerContext = createContext<AppRouter>("router");

export class AppRouter extends LitRouter {
  private readonly _pathname = new Subject<Observable<string>>();
  public readonly pathname$ = this._pathname.pipe(switchAll());

  async goto(p: string): Promise<void> {
    const pathname = p.replace(/\/$/, "");
    await super.goto(pathname);
    this._pathname.next(mkIdleObservable().pipe(map(() => pathname)));
  }
}
