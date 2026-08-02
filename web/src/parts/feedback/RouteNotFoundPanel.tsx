"use client";

import { useTranslation } from "react-i18next";

import { TextLink } from "@/components/TextLink";
import { ROUTES } from "@/constants/routes";

import { EmptyPanel } from "./EmptyPanel";

export const RouteNotFoundPanel = () => {
  const { t } = useTranslation();

  return (
    <div className="px-gutter pt-16 pb-24">
      <div className="max-w-feed mx-auto">
        <EmptyPanel
          title={t("boundary.notFound.title")}
          description={t("boundary.notFound.description")}
          action={<TextLink href={ROUTES.feed} label={t("boundary.backToFeed")} />}
        />
      </div>
    </div>
  );
};
