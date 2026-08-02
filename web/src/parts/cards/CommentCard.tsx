"use client";

import { useTranslation } from "react-i18next";

import { ActionPill } from "@/components/ActionPill";
import { BlockedBadge } from "@/components/BlockedBadge";
import { Surface } from "@/components/Surface";
import { CommentForm } from "@/parts/forms/CommentForm";
import type { Comment, CommentWrite } from "@/types/comment";
import { cn } from "@/utils/cn";

type CommentCardProps = {
  comment: Comment;
  isEditing: boolean;
  isSaving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: (values: CommentWrite) => void;
  onDelete: () => void;
};

export const CommentCard = ({
  comment,
  isEditing,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
}: CommentCardProps) => {
  const { t } = useTranslation("post");

  return (
    <Surface tone={comment.isBlocked ? "blocked" : "raised"}>
      <article className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-secondary text-meta">
            {t("meta.author", { id: comment.ownerId })}
          </p>
          <p className="text-secondary text-meta">{comment.createdAt}</p>
          {comment.isBlocked ? (
            <BlockedBadge label={t("comments.blockedBadge")} />
          ) : null}
        </div>
        {isEditing ? (
          <CommentForm
            mode="edit"
            initialInfo={comment.info}
            isPending={isSaving}
            onSubmit={onSubmitEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            <p
              className={cn(
                "text-prose max-w-prose font-serif whitespace-pre-wrap text-pretty",
                comment.isBlocked ? "text-blocked-fg" : "text-text",
              )}
            >
              {comment.info}
            </p>
            {comment.isMine ? (
              <div className="flex flex-wrap gap-2">
                <ActionPill
                  label={t("actions.edit")}
                  isDisabled={false}
                  onClick={onStartEdit}
                />
                <ActionPill
                  label={t("actions.delete")}
                  isDisabled={false}
                  onClick={onDelete}
                />
              </div>
            ) : null}
          </>
        )}
      </article>
    </Surface>
  );
};
