import type { Theme } from "./theme.types";

export const THEME_STORAGE_KEY = "ledger.theme";

const THEME_CHANGE_EVENT = "ledger:theme-change";

export const readAppliedTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

export const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
};

export const subscribeToTheme = (onThemeChange: () => void): (() => void) => {
  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
};
