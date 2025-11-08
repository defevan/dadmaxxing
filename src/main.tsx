/**
 * Polyfills.
 */
import "requestidlecallback-polyfill";
import "urlpattern-polyfill"; // for lit router

/**
 * UI libraries.
 */
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/components/format-date/format-date.js";
import "@shoelace-style/shoelace/dist/components/divider/divider.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";

/**
 * Web components.
 */
import "./components/app";
import "./components/footer";
import "./components/header";
import "./components/post-list";
