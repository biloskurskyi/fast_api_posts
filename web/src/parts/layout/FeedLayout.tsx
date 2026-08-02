"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { PageTitle } from "@/components/PageTitle";

type FeedLayoutProps = {
  children: ReactNode;
};

export const FeedLayout = ({ children }: FeedLayoutProps) => {
  const { t } = useTranslation("feed");

  return (
    <div className="px-gutter pt-12 pb-24">
      <div className="max-w-feed mx-auto flex flex-col gap-6">
        <PageTitle>{t("title")}</PageTitle>
        {children}
      </div>
    </div>
  );
};
