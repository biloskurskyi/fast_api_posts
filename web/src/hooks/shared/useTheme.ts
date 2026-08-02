"use client";

import { useSyncExternalStore } from "react";

import type { Theme } from "@/theme/theme.types";
import { applyTheme, readAppliedTheme, subscribeToTheme } from "@/theme/themeStorage";

const SERVER_RENDERED_THEME: Theme = "light";

const readServerTheme = (): Theme => SERVER_RENDERED_THEME;

export const useTheme = () => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    readAppliedTheme,
    readServerTheme,
  );

  const toggleTheme = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, toggleTheme };
};
