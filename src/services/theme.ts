import { signal } from "@lit-labs/signals";
import { constant, either, type Decoder } from "decoders";

export type ThemeValue = "light" | "dark";

const STORAGE_KEY = "app-theme";

const decoder: Decoder<ThemeValue> = either(
  constant("light"),
  constant("dark"),
);

function localStorageValue(): ThemeValue | undefined {
  return decoder.value(localStorage.getItem(STORAGE_KEY));
}

function userAgentValue(): ThemeValue {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export class Theme {
  activeTheme = signal(localStorageValue() ?? userAgentValue());

  toggle = () => {
    const next = this.activeTheme.get() === "dark" ? "light" : "dark";
    this.activeTheme.set(next);
    localStorage.setItem(STORAGE_KEY, next);
  };
}
