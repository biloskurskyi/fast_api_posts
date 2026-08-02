"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { PageTitle } from "@/components/PageTitle";
import type { PostEditorMode } from "@/types/post";

type EditorLayoutProps = {
  mode: PostEditorMode;
  children: ReactNode;
};

export const EditorLayout = ({ mode, children }: EditorLayoutProps) => {
  const { t } = useTranslation("editor");

  return (
    <div className="px-gutter pt-12 pb-24">
      <div className="max-w-editor mx-auto flex flex-col gap-6">
        <PageTitle>{t(`${mode}.title`)}</PageTitle>
        {children}
      </div>
    </div>
  );
};
