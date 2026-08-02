"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/auth/useAuth";
import {
  COMMENT_THREAD_PAGE_SIZE,
  COMMENT_THREAD_PAGINATION,
  FIRST_PAGE,
} from "@/constants/pagination";
import { ROUTES } from "@/constants/routes";
import { useCommentQueries } from "@/hooks/queries/useCommentQueries";
import { usePostDetailQueries } from "@/hooks/queries/usePostDetailQueries";
import { usePaginationParams } from "@/hooks/shared/usePaginationParams";
import { toComments } from "@/mappers/comment.mapper";
import { toPostDetail } from "@/mappers/post.mapper";
import type { CommentWrite } from "@/types/comment";
import { UNRESOLVED_POST_ID, toPostId } from "@/utils/postId";

const FIRST_COMPOSER_KEY = 0;

export const usePostScreen = () => {
  const router = useRouter();
  const params = useParams();
  const { userId, isAuthenticated } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [composerResetKey, setComposerResetKey] = useState(FIRST_COMPOSER_KEY);
  const [hasBlockedCommentNotice, setHasBlockedCommentNotice] = useState(false);

  const postId = toPostId(params.postId);
  const isPostIdResolved = postId !== UNRESOLVED_POST_ID;
  const { page, goToPage } = usePaginationParams(COMMENT_THREAD_PAGINATION);
  const { postDetail, deletePost } = usePostDetailQueries({
    postId,
    isEnabled: isPostIdResolved,
  });
  const { commentThread, createComment, updateComment, deleteComment } = useCommentQueries({
    postId,
    page,
    pageSize: COMMENT_THREAD_PAGE_SIZE,
    isEnabled: isPostIdResolved,
  });

  const postDto = postDetail.data ?? null;
  const commentDtos = commentThread.data?.items ?? [];
  const isPostNotFound = !isPostIdResolved || postDetail.error?.code === "post_not_found";
  const closeEditor = () => {
    setEditingCommentId(null);
  };

  return {
    post: postDto === null ? null : toPostDetail(postDto, userId),
    isPostLoading: isPostIdResolved && postDetail.isPending,
    isPostNotFound,
    postError: isPostNotFound ? null : postDetail.error,
    retryPost: () => {
      void postDetail.refetch();
    },
    isDeletingPost: deletePost.isPending,
    deletePostError: deletePost.error,
    deletePost: () => {
      deletePost.mutate(undefined, {
        onSuccess: () => {
          router.replace(ROUTES.feedAfterPostDeleted);
        },
      });
    },

    comments: toComments(commentDtos, userId),
    isThreadLoading: isPostIdResolved && commentThread.isPending,
    isThreadEmpty: commentThread.data !== undefined && commentDtos.length === 0,
    hasComments: commentDtos.length > 0,
    threadError: commentThread.error,
    retryThread: () => {
      void commentThread.refetch();
    },
    commentActionError: updateComment.error ?? deleteComment.error,
    editingCommentId,
    isSavingComment: updateComment.isPending,
    startEditingComment: (commentId: number) => {
      setEditingCommentId(commentId);
    },
    cancelEditingComment: closeEditor,
    submitCommentEdit: (commentId: number, values: CommentWrite) => {
      updateComment.mutate({ commentId, body: values }, { onSuccess: closeEditor });
    },
    removeComment: (commentId: number) => {
      deleteComment.mutate(commentId);
    },

    commentsPage: page,
    hasPreviousComments: page > FIRST_PAGE,
    hasNextComments:
      (commentThread.data?.hasNext ?? false) && !commentThread.isPlaceholderData,
    goToPreviousCommentsPage: () => {
      goToPage(page - 1);
    },
    goToNextCommentsPage: () => {
      goToPage(page + 1);
    },

    isSignedIn: isAuthenticated,
    isPostingComment: createComment.isPending,
    createCommentError: createComment.error,
    composerResetKey,
    hasBlockedCommentNotice,
    dismissBlockedCommentNotice: () => {
      setHasBlockedCommentNotice(false);
    },
    postComment: (values: CommentWrite) => {
      createComment.mutate(values, {
        onSuccess: (comment) => {
          setHasBlockedCommentNotice(comment.blocked_at !== null);
          setComposerResetKey((key) => key + 1);
        },
      });
    },
  };
};
