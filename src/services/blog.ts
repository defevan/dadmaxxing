import { createContext } from "@lit/context";
import { combineLatest, Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { shareReplay, switchMap } from "rxjs/operators";
import type { Meta, Post } from "../../shared/types";

export const blogContext = createContext<Blog>("blog");

export class Blog {
  readonly meta$: Observable<Meta> = fromFetch(
    `${import.meta.env.BASE_URL}/meta.json`,
  ).pipe(
    switchMap((it) => it.json()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly posts$: Observable<Array<Post>> = fromFetch(
    `${import.meta.env.BASE_URL}/posts.json`,
  ).pipe(
    switchMap((it) => it.json()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor() {
    combineLatest([this.meta$, this.posts$]).subscribe({
      error: (err) => console.warn("failed to load tumblr data", err),
    });
  }
}
