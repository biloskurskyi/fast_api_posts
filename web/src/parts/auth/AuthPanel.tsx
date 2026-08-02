"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { PageTitle } from "@/components/PageTitle";
import { Surface } from "@/components/Surface";
import type { AuthMode } from "@/types/session";

type AuthPanelProps = {
  mode: AuthMode;
  children: ReactNode;
};

export const AuthPanel = ({ mode, children }: AuthPanelProps) => {
  const { t } = useTranslation("auth");

  return (
    <div className="px-gutter pt-16 pb-24">
      <div className="max-w-auth mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <PageTitle>{t(`${mode}.title`)}</PageTitle>
          <p className="text-secondary text-prose font-serif">{t(`${mode}.blurb`)}</p>
        </div>
        <Surface>
          <div className="flex flex-col gap-6">{children}</div>
        </Surface>
      </div>
    </div>
  );
};
