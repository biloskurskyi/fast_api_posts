"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { commentApi } from "@/api/commentApi";
import type { ApiError } from "@/errors/apiError.types";
import { toPage, toPageRequest } from "@/mappers/page.mapper";
import type { CommentDto, CommentWrite } from "@/types/comment";
import type { Page } from "@/types/pagination";

import { postKeys } from "./postKeys";

type CommentQueriesOptions = {
  postId: number;
  page: number;
  pageSize: number;
  isEnabled: boolean;
};

type CommentUpdate = {
  commentId: number;
  body: CommentWrite;
};

export const useCommentQueries = ({
  postId,
  page,
  pageSize,
  isEnabled,
}: CommentQueriesOptions) => {
  const queryClient = useQueryClient();

  const commentThread = useQuery<CommentDto[], ApiError, Page<CommentDto>>({
    queryKey: postKeys.commentPage(postId, { page, pageSize }),
    queryFn: () => commentApi.list(postId, toPageRequest(page, pageSize)),
    select: (dtos) => toPage(dtos, pageSize),
    placeholderData: keepPreviousData,
    enabled: isEnabled,
  });

  const invalidateThread = () =>
    queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });

  const createComment = useMutation<CommentDto, ApiError, CommentWrite>({
    mutationFn: (body) => commentApi.create(postId, body),
    onSuccess: invalidateThread,
  });

  const updateComment = useMutation<CommentDto, ApiError, CommentUpdate>({
    mutationFn: ({ commentId, body }) => commentApi.update(commentId, body),
    onSuccess: invalidateThread,
  });

  const deleteComment = useMutation<void, ApiError, number>({
    mutationFn: commentApi.remove,
    onSuccess: invalidateThread,
  });

  return { commentThread, createComment, updateComment, deleteComment };
};
