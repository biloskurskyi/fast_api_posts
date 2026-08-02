"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { PageTitle } from "@/components/PageTitle";

type SettingsLayoutProps = {
  children: ReactNode;
};

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const { t } = useTranslation("settings");

  return (
    <div className="px-gutter pt-12 pb-24">
      <div className="max-w-settings mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <PageTitle>{t("title")}</PageTitle>
          <p className="text-secondary text-prose max-w-prose font-serif text-pretty">
            {t("blurb")}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
