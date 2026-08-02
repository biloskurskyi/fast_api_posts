"use client";

import { usePostScreen } from "@/hooks/pages/usePostScreen";
import { PostDetailPanel } from "@/parts/cards/PostDetailPanel";
import { PostDetailSkeleton } from "@/parts/cards/PostDetailSkeleton";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import { PostNotFoundPanel } from "@/parts/feedback/PostNotFoundPanel";
import { CommentComposer } from "@/parts/forms/CommentComposer";
import { PostLayout } from "@/parts/layout/PostLayout";
import { CommentThread } from "@/parts/lists/CommentThread";
import { PaginationControls } from "@/parts/pagination/PaginationControls";

export const PostScreen = () => {
  const {
    post,
    isPostLoading,
    isPostNotFound,
    postError,
    retryPost,
    isDeletingPost,
    deletePostError,
    deletePost,
    comments,
    isThreadLoading,
    isThreadEmpty,
    hasComments,
    threadError,
    retryThread,
    commentActionError,
    editingCommentId,
    isSavingComment,
    startEditingComment,
    cancelEditingComment,
    submitCommentEdit,
    removeComment,
    commentsPage,
    hasPreviousComments,
    hasNextComments,
    goToPreviousCommentsPage,
    goToNextCommentsPage,
    isSignedIn,
    isPostingComment,
    postComment,
    composerResetKey,
    createCommentError,
    hasBlockedCommentNotice,
    dismissBlockedCommentNotice,
  } = usePostScreen();

  return (
    <PostLayout>
      {isPostLoading ? <PostDetailSkeleton /> : null}
      {isPostNotFound ? <PostNotFoundPanel /> : null}
      <ApiErrorBanner error={postError} onRetry={retryPost} />
      {post === null ? null : (
        <>
          <PostDetailPanel
            post={post}
            isDeleting={isDeletingPost}
            deleteError={deletePostError}
            onDelete={deletePost}
          />
          <CommentThread
            comments={comments}
            isLoading={isThreadLoading}
            isEmpty={isThreadEmpty}
            error={threadError}
            actionError={commentActionError}
            onRetry={retryThread}
            editingCommentId={editingCommentId}
            isSaving={isSavingComment}
            onStartEdit={startEditingComment}
            onCancelEdit={cancelEditingComment}
            onSubmitEdit={submitCommentEdit}
            onDelete={removeComment}
          />
          {hasComments ? (
            <PaginationControls
              page={commentsPage}
              hasPrevious={hasPreviousComments}
              hasNext={hasNextComments}
              onPreviousPage={goToPreviousCommentsPage}
              onNextPage={goToNextCommentsPage}
            />
          ) : null}
          <CommentComposer
            isSignedIn={isSignedIn}
            isPending={isPostingComment}
            resetKey={composerResetKey}
            error={createCommentError}
            hasBlockedNotice={hasBlockedCommentNotice}
            onDismissBlockedNotice={dismissBlockedCommentNotice}
            onSubmit={postComment}
          />
        </>
      )}
    </PostLayout>
  );
};
