import { Observable } from "rxjs";

export function mkIdleObservable() {
  return new Observable<void>((obs) => {
    const id = requestIdleCallback(() => {
      obs.next();
      obs.complete();
    });
    return () => cancelIdleCallback(id);
  });
}
