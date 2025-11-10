import { Signal, SignalWatcher } from "@lit-labs/signals";
import { customElement, property } from "lit/decorators.js";
import { AppElement } from "../lib/element";
import type { ThemeValue } from "../services/theme";
import "./theme.scss";

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
