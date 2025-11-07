import type { LitElement } from "lit";
import type { Observable, Subscription } from "rxjs";

export function observe<Proto extends LitElement, Field extends keyof Proto>(
  factory: (arg: Proto) => Observable<Proto[Field]>,
) {
  return function (proto: Proto, key: Field) {
    let sub: Subscription | undefined = undefined;

    const connectedCallback = proto.connectedCallback;
    const disconnectedCallback = proto.disconnectedCallback;

    proto.connectedCallback = function () {
      connectedCallback.call(this);
      sub = factory(this).subscribe((value) => {
        this[key] = value;
        this.requestUpdate();
      });
    };

    proto.disconnectedCallback = function () {
      sub?.unsubscribe();
      disconnectedCallback.call(this);
    };
  };
}
