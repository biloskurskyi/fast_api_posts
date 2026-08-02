"use client";

import { useTranslation } from "react-i18next";

import { TextLink } from "@/components/TextLink";
import { ROUTES } from "@/constants/routes";

import { EmptyPanel } from "./EmptyPanel";

export const PostNotFoundPanel = () => {
  const { t } = useTranslation("post");

  return (
    <EmptyPanel
      title={t("notFound.title")}
      description={t("notFound.description")}
      action={<TextLink href={ROUTES.feed} label={t("notFound.action")} />}
    />
  );
};
