import { Observable } from "rxjs";

export function mkIdleObservable() {
  return new Observable<void>((obs) => {
    const id = requestIdleCallback(() => obs.next());
    return () => cancelIdleCallback(id);
  });
}
