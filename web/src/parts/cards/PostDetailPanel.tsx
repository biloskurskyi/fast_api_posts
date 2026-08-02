"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionPill } from "@/components/ActionPill";
import { ActionPillLink } from "@/components/ActionPillLink";
import { Surface } from "@/components/Surface";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/errors/apiError.types";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import { ConfirmDeleteDialog } from "@/parts/modals/ConfirmDeleteDialog";
import type { PostDetail } from "@/types/post";

type PostDetailPanelProps = {
  post: PostDetail;
  isDeleting: boolean;
  deleteError: ApiError | null;
  onDelete: () => void;
};

export const PostDetailPanel = ({
  post,
  isDeleting,
  deleteError,
  onDelete,
}: PostDetailPanelProps) => {
  const { t } = useTranslation("post");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <Surface padding="wide">
      <article className="flex flex-col gap-4">
        <h1 className="text-text text-post-title font-serif font-semibold">
          {post.title}
        </h1>
        <p className="text-secondary text-meta">
          {t("meta.author", { id: post.ownerId })}
        </p>
        {post.isMine ? (
          <div className="flex flex-wrap gap-2">
            <ActionPillLink
              href={ROUTES.editPost(post.id)}
              label={t("actions.edit")}
            />
            <ActionPill
              label={t("actions.delete")}
              isDisabled={isConfirmingDelete || isDeleting}
              onClick={() => {
                setIsConfirmingDelete(true);
              }}
            />
          </div>
        ) : null}
        <ApiErrorBanner error={deleteError} />
        {isConfirmingDelete ? (
          <ConfirmDeleteDialog
            message={t("confirmDelete.message")}
            confirmLabel={t("confirmDelete.confirm")}
            cancelLabel={t("confirmDelete.cancel")}
            isBusy={isDeleting}
            onConfirm={onDelete}
            onCancel={() => {
              setIsConfirmingDelete(false);
            }}
          />
        ) : null}
        <p className="text-text text-prose max-w-prose font-serif whitespace-pre-wrap text-pretty">
          {post.content}
        </p>
      </article>
    </Surface>
  );
};
