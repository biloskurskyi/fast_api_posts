"use client";

import { useTranslation } from "react-i18next";

import { PillButton } from "@/components/PillButton";
import { useTheme } from "@/hooks/shared/useTheme";

export const ThemeToggle = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const targetThemeLabel = theme === "dark" ? t("theme.light") : t("theme.dark");

  return (
    <PillButton
      label={targetThemeLabel}
      ariaLabel={t("theme.switchTo", { theme: targetThemeLabel })}
      onClick={toggleTheme}
    />
  );
};
