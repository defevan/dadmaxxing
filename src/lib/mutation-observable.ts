import { Observable } from "rxjs";

export function mkMutationObservable(node: Node) {
  return new Observable<void>((obs) => {
    const observer = new MutationObserver(() => obs.next());
    observer.observe(node, { childList: true, subtree: true });
    return () => observer.disconnect();
  });
}
