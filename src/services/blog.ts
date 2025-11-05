import type { Immutable } from "immer";
import {
  combineLatest,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from "rxjs";
import type { Meta, Post } from "../../shared/types";

export const blog = new (class {
  private readonly _fetchSub = new Subject<void>();

  public readonly meta$: Observable<Immutable<Meta> | null> =
    this._fetchSub.pipe(
      switchMap(() => fetch(`${import.meta.env.BASE_URL}/meta.json`)),
      switchMap((it) => it.json()),
      startWith(null),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  public readonly posts$: Observable<Immutable<Array<Post>> | null> =
    this._fetchSub.pipe(
      switchMap(() => fetch(`${import.meta.env.BASE_URL}/posts.json`)),
      switchMap((it) => it.json()),
      startWith(null),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  public load() {
    combineLatest([this.meta$, this.posts$]).subscribe({
      error: (err) => console.error("failed to fetch meta and/or posts", err),
    });

    this._fetchSub.next();
  }

  public refetch() {
    this._fetchSub.next();
  }
})();
