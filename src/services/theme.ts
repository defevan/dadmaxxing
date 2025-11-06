import { createContext } from "@lit/context";
import { constant, either, type Decoder } from "decoders";
import { BehaviorSubject } from "rxjs";

export const themeContext = createContext<Theme>("theme");

type Themes = "light" | "dark";

const STORAGE_KEY = "app-theme";

const decoder: Decoder<Themes> = either(constant("light"), constant("dark"));

function localStorageValue(): Themes | undefined {
  return decoder.value(localStorage.getItem(STORAGE_KEY));
}

function userAgentValue(): Themes {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export class Theme {
  readonly #theme = new BehaviorSubject<Themes>(
    localStorageValue() ?? userAgentValue(),
  );

  readonly theme$ = this.#theme.asObservable();

  toggle() {
    this.#theme.next(this.#theme.getValue() === "dark" ? "light" : "dark");
  }

  constructor() {
    this.theme$.subscribe({
      next: (v) => {
        localStorage.setItem(STORAGE_KEY, v);
        if (v === "dark") {
          document.documentElement.classList.add("sl-theme-dark");
        } else {
          document.documentElement.classList.remove("sl-theme-dark");
        }
      },
      error: (err) => console.warn("failed to apply theme", { err }),
    });
  }
}
