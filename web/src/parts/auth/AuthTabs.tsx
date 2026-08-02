"use client";

import { useTranslation } from "react-i18next";

import { Tabs } from "@/components/Tabs";
import type { AuthMode } from "@/types/session";

type AuthTabsProps = {
  mode: AuthMode;
  onSelect: (mode: AuthMode) => void;
};

export const AuthTabs = ({ mode, onSelect }: AuthTabsProps) => {
  const { t } = useTranslation("auth");

  const modeItems = [
    { value: "signIn", label: t("signIn.cta") },
    { value: "register", label: t("register.cta") },
  ] as const;

  return (
    <Tabs
      ariaLabel={t("tabs.ariaLabel")}
      value={mode}
      items={modeItems}
      onSelect={onSelect}
    />
  );
};
