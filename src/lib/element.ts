import { Subject } from "rxjs";

export class UnsubElement extends HTMLElement {
  protected readonly _unsub = new Subject<void>();

  public disconnectedCallback(): void {
    this._unsub.next();
    this._unsub.complete();
  }
}
