export function tsx(
  tag: string,
  props?: Record<string, any>,
  ...children: (HTMLElement | string)[]
): HTMLElement {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (typeof value === "function") {
      el.addEventListener(key, value);
    } else if (key === "innerHTML") {
      el.innerHTML = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  for (const child of children.flat()) {
    if (child instanceof HTMLElement) {
      el.appendChild(child);
    } else {
      el.appendChild(document.createTextNode(child));
    }
  }
  return el;
}
