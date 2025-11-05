interface HTMLElement {
  connectedCallback(): void;
  disconnectedCallback(): void;
}

declare namespace JSX {
  interface IntrinsicElements {
    [tag: string]: any;
  }
}
