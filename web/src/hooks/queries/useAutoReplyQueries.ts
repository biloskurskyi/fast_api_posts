"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { autoReplyApi } from "@/api/autoReplyApi";
import type { ApiError } from "@/errors/apiError.types";
import type { AutoReplySettingsDto } from "@/types/autoReply";

import { autoReplyKeys } from "./autoReplyKeys";

export const useAutoReplyQueries = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery<AutoReplySettingsDto, ApiError>({
    queryKey: autoReplyKeys.all,
    queryFn: autoReplyApi.get,
  });

  const updateSettings = useMutation<
    AutoReplySettingsDto,
    ApiError,
    AutoReplySettingsDto
  >({
    mutationFn: autoReplyApi.update,
    onSuccess: (saved) => {
      queryClient.setQueryData(autoReplyKeys.all, saved);
    },
  });

  return { settingsQuery, updateSettings };
};
