"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { postApi } from "@/api/postApi";
import type { ApiError } from "@/errors/apiError.types";
import type { PostDto, PostWrite } from "@/types/post";

import { postKeys } from "./postKeys";

type PostDetailQueriesOptions = {
  postId: number;
  isEnabled: boolean;
};

export const usePostDetailQueries = ({ postId, isEnabled }: PostDetailQueriesOptions) => {
  const queryClient = useQueryClient();

  const postDetail = useQuery<PostDto, ApiError>({
    queryKey: postKeys.detail(postId),
    queryFn: () => postApi.get(postId),
    enabled: isEnabled,
  });

  const updatePost = useMutation<PostDto, ApiError, PostWrite>({
    mutationFn: (body) => postApi.update(postId, body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) }),
        queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
      ]);
    },
  });

  const deletePost = useMutation<void, ApiError, void>({
    mutationFn: () => postApi.remove(postId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  return { postDetail, updatePost, deletePost };
};
