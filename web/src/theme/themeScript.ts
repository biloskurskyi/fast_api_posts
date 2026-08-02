import { THEME_STORAGE_KEY } from "./themeStorage";

export const themePrePaintScript = `(function(){var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});document.documentElement.dataset.theme=s==="dark"||s==="light"?s:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"})()`;
