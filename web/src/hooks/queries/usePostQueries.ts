"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { postApi } from "@/api/postApi";
import type { ApiError } from "@/errors/apiError.types";
import { toPage, toPageRequest } from "@/mappers/page.mapper";
import type { Page, PageParams } from "@/types/pagination";
import type { PostDto } from "@/types/post";

import { postKeys } from "./postKeys";

export const usePostQueries = ({ page, pageSize }: PageParams) => {
  const postList = useQuery<PostDto[], ApiError, Page<PostDto>>({
    queryKey: postKeys.list({ page, pageSize }),
    queryFn: () => postApi.list(toPageRequest(page, pageSize)),
    select: (dtos) => toPage(dtos, pageSize),
    placeholderData: keepPreviousData,
  });

  return { postList };
};
