"use client";

import { useTranslation } from "react-i18next";

import type { ApiError } from "@/errors/apiError.types";
import { CommentCard } from "@/parts/cards/CommentCard";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import { EmptyPanel } from "@/parts/feedback/EmptyPanel";
import { SurfaceListSkeleton } from "@/parts/feedback/SurfaceListSkeleton";
import type { Comment, CommentWrite } from "@/types/comment";

const SKELETON_CARD_COUNT = 3;
const SKELETON_LINE_COUNT = 2;

type CommentThreadProps = {
  comments: Comment[];
  isLoading: boolean;
  isEmpty: boolean;
  error: ApiError | null;
  actionError: ApiError | null;
  onRetry: () => void;
  editingCommentId: number | null;
  isSaving: boolean;
  onStartEdit: (commentId: number) => void;
  onCancelEdit: () => void;
  onSubmitEdit: (commentId: number, values: CommentWrite) => void;
  onDelete: (commentId: number) => void;
};

export const CommentThread = ({
  comments,
  isLoading,
  isEmpty,
  error,
  actionError,
  onRetry,
  editingCommentId,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
}: CommentThreadProps) => {
  const { t } = useTranslation("post");

  return (
    <section className="mt-6 flex flex-col gap-4">
      <h2 className="text-secondary text-meta tracking-heading font-semibold uppercase">
        {t("comments.heading")}
      </h2>
      {isLoading ? (
        <SurfaceListSkeleton
          cardCount={SKELETON_CARD_COUNT}
          lineCount={SKELETON_LINE_COUNT}
        />
      ) : null}
      <ApiErrorBanner error={error} onRetry={onRetry} />
      <ApiErrorBanner error={actionError} />
      {isEmpty ? <EmptyPanel title={t("comments.empty")} padding="compact" /> : null}
      <ul className="flex flex-col gap-3">
        {comments.map((comment) => (
          <li key={comment.id}>
            <CommentCard
              comment={comment}
              isEditing={comment.id === editingCommentId}
              isSaving={isSaving}
              onStartEdit={() => {
                onStartEdit(comment.id);
              }}
              onCancelEdit={onCancelEdit}
              onSubmitEdit={(values) => {
                onSubmitEdit(comment.id, values);
              }}
              onDelete={() => {
                onDelete(comment.id);
              }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
