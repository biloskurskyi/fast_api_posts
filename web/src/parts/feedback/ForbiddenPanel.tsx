"use client";

import type { Route } from "next";
import { useTranslation } from "react-i18next";

import { TextLink } from "@/components/TextLink";

import { EmptyPanel } from "./EmptyPanel";

type ForbiddenPanelProps<T extends string> = {
  postHref: Route<T>;
};

export const ForbiddenPanel = <T extends string>({
  postHref,
}: ForbiddenPanelProps<T>) => {
  const { t } = useTranslation("editor");

  return (
    <EmptyPanel
      title={t("forbidden.title")}
      description={t("forbidden.description")}
      action={<TextLink href={postHref} label={t("forbidden.action")} />}
    />
  );
};
