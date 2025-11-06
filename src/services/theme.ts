import { createContext } from "@lit/context";
import { constant, either, type Decoder } from "decoders";
import { BehaviorSubject, shareReplay, tap } from "rxjs";

export const themeContext = createContext<Theme>("theme");

type ThemeOptions = "light" | "dark";

const STORAGE_KEY = "app-theme";

const decoder: Decoder<ThemeOptions> = either(
  constant("light"),
  constant("dark"),
);

function localStorageValue(): ThemeOptions | undefined {
  return decoder.value(localStorage.getItem(STORAGE_KEY));
}

function userAgentValue(): ThemeOptions {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export class Theme {
  private readonly _theme = new BehaviorSubject<ThemeOptions>(
    localStorageValue() ?? userAgentValue(),
  );

  public readonly theme$ = this._theme.asObservable();

  toggle() {
    this._theme.next(this._theme.getValue() === "dark" ? "light" : "dark");
  }

  apply() {
    return this.theme$.pipe(
      tap((v) => {
        localStorage.setItem(STORAGE_KEY, v);
        if (v === "light") {
          document.documentElement.classList.remove("sl-theme-dark");
          return;
        }
        document.documentElement.classList.add("sl-theme-dark");
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
