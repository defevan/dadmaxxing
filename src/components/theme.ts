import { Signal, SignalWatcher } from "@lit-labs/signals";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AppElement } from "../lib/element";
import type { ThemeValue } from "../services/theme";
import "./theme.scss";

export function renderTheme({
  activeTheme,
}: {
  activeTheme: Signal.State<ThemeValue>;
}) {
  return html` <app-theme .activeTheme=${activeTheme}></app-theme> `;
}

@customElement("app-theme")
export class ThemeElement extends SignalWatcher(AppElement) {
  @property()
  activeTheme?: Signal.State<ThemeValue>;

  updated() {
    const v = this.activeTheme?.get();
    if (v === "dark") {
      document.documentElement.classList.add("sl-theme-dark");
    } else {
      document.documentElement.classList.remove("sl-theme-dark");
    }
  }
}
