"use client";

import { useTranslation } from "react-i18next";

import { TextLink } from "@/components/TextLink";
import { ROUTES } from "@/constants/routes";
import { EmptyPanel } from "@/parts/feedback/EmptyPanel";

export const SignInPrompt = () => {
  const { t } = useTranslation("post");

  return (
    <EmptyPanel
      title={t("comments.signInPrompt.title")}
      padding="compact"
      action={<TextLink href={ROUTES.signIn} label={t("comments.signInPrompt.action")} />}
    />
  );
};
