"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/ButtonLink";
import { PageTitle } from "@/components/PageTitle";
import { ROUTES } from "@/constants/routes";

type FeedLayoutProps = {
  canCreatePost: boolean;
  children: ReactNode;
};

export const FeedLayout = ({ canCreatePost, children }: FeedLayoutProps) => {
  const { t } = useTranslation("feed");

  return (
    <div className="px-gutter pt-12 pb-24">
      <div className="max-w-feed mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <PageTitle>{t("title")}</PageTitle>
          {canCreatePost ? (
            <ButtonLink href={ROUTES.newPost} label={t("actions.newPost")} />
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
};
