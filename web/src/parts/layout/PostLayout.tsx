"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { TextLink } from "@/components/TextLink";
import { ROUTES } from "@/constants/routes";

type PostLayoutProps = {
  children: ReactNode;
};

export const PostLayout = ({ children }: PostLayoutProps) => {
  const { t } = useTranslation("post");

  return (
    <div className="px-gutter pt-10 pb-28">
      <div className="max-w-post mx-auto flex flex-col gap-6">
        <TextLink href={ROUTES.feed} label={t("backToFeed")} />
        {children}
      </div>
    </div>
  );
};
