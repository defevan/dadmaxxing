import navigo from "navigo";
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  shareReplay,
} from "rxjs";

class Router {
  private readonly _router = new navigo("/");

  private readonly _url = new BehaviorSubject<URL>(
    new URL(window.location.toString()),
  );

  public readonly path$: Observable<string> = this._url.pipe(
    map((url) => url.pathname.replace(import.meta.env.BASE_URL, "")),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public load(): void {
    this._router.on("*", (evt) => {
      const url =
        evt?.url !== undefined
          ? `${window.location.origin}/${evt.url}`
          : window.location.toString();
      this._url.next(new URL(url));
    });
    this._router.resolve();
  }

  public async navigate(url: URL): Promise<void> {
    const current = await firstValueFrom(this.path$);
    if (current === url.pathname) {
      return;
    }
    this._router.navigate(url.pathname);
    window.scrollTo(0, 0);
  }
}

export const router = new Router();
