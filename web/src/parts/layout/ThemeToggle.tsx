"use client";

import { useTranslation } from "react-i18next";

import { PillButton } from "@/components/PillButton";
import { useTheme } from "@/hooks/shared/useTheme";

type ThemeToggleProps = {
  onAfterToggle?: () => void;
};

export const ThemeToggle = ({ onAfterToggle }: ThemeToggleProps) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const targetThemeLabel = theme === "dark" ? t("theme.light") : t("theme.dark");

  const toggleThemeAndClose = () => {
    toggleTheme();
    onAfterToggle?.();
  };

  return (
    <PillButton
      label={targetThemeLabel}
      ariaLabel={t("theme.switchTo", { theme: targetThemeLabel })}
      onClick={toggleThemeAndClose}
    />
  );
};
