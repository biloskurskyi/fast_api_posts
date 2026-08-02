"use client";

import { useTranslation } from "react-i18next";

import { Banner } from "@/components/Banner";
import type { ApiError } from "@/errors/apiError.types";
import { SignInPrompt } from "@/parts/auth/SignInPrompt";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import type { CommentWrite } from "@/types/comment";

import { CommentForm } from "./CommentForm";

type CommentComposerProps = {
  isSignedIn: boolean;
  isPending: boolean;
  resetKey: number;
  error: ApiError | null;
  hasBlockedNotice: boolean;
  onDismissBlockedNotice: () => void;
  onSubmit: (values: CommentWrite) => void;
};

export const CommentComposer = ({
  isSignedIn,
  isPending,
  resetKey,
  error,
  hasBlockedNotice,
  onDismissBlockedNotice,
  onSubmit,
}: CommentComposerProps) => {
  const { t } = useTranslation("post");

  if (!isSignedIn) return <SignInPrompt />;

  return (
    <div className="flex flex-col gap-3">
      {hasBlockedNotice ? (
        <Banner
          message={t("comments.blockedNotice")}
          actionLabel={t("actions.dismiss")}
          onAction={onDismissBlockedNotice}
        />
      ) : null}
      <ApiErrorBanner error={error} />
      <CommentForm
        key={resetKey}
        mode="create"
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
};
