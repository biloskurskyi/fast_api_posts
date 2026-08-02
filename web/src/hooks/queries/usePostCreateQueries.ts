"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postApi } from "@/api/postApi";
import type { ApiError } from "@/errors/apiError.types";
import type { PostDto, PostWrite } from "@/types/post";

import { postKeys } from "./postKeys";

export const usePostCreateQueries = () => {
  const queryClient = useQueryClient();

  const createPost = useMutation<PostDto, ApiError, PostWrite>({
    mutationFn: postApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  return { createPost };
};
