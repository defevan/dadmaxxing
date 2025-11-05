import type { LitElement } from "lit";
import { Subject, takeUntil, type Observable } from "rxjs";

export function observe<Proto extends LitElement, Field extends keyof Proto>(
  factory: (arg: Proto) => Observable<Proto[Field]>,
) {
  return function (proto: Proto, key: Field) {
    const unsub = new Subject<void>();

    const connectedCallback = proto.connectedCallback;
    const disconnectedCallback = proto.disconnectedCallback;

    proto.connectedCallback = function () {
      connectedCallback.call(this);
      factory(this)
        .pipe(takeUntil(unsub))
        .subscribe((value) => {
          this[key] = value;
          this.requestUpdate();
        });
    };

    proto.disconnectedCallback = function () {
      disconnectedCallback.call(this);
      unsub.next();
      unsub.complete();
    };
  };
}
