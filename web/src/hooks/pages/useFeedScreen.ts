"use client";

import { useAuth } from "@/auth/useAuth";
import { FEED_PAGINATION, FIRST_PAGE } from "@/constants/pagination";
import { usePostQueries } from "@/hooks/queries/usePostQueries";
import { usePaginationParams } from "@/hooks/shared/usePaginationParams";
import { toPosts } from "@/mappers/post.mapper";

export const useFeedScreen = () => {
  const { isAuthenticated } = useAuth();
  const { page, pageSize, goToPage, selectPageSize } =
    usePaginationParams(FEED_PAGINATION);
  const { postList } = usePostQueries({ page, pageSize });

  const posts = toPosts(postList.data?.items ?? []);
  const isListVisible = postList.data !== undefined;
  const isFirstPage = page === FIRST_PAGE;

  return {
    canCreatePost: isAuthenticated,
    posts,
    isLoading: postList.isPending,
    isBusy: postList.isPlaceholderData,
    isListVisible,
    isPastTheEnd: isListVisible && posts.length === 0 && !isFirstPage,
    hasResults: posts.length > 0,
    error: postList.error,
    retry: () => {
      void postList.refetch();
    },
    page,
    pageSize,
    hasPrevious: !isFirstPage,
    hasNext: (postList.data?.hasNext ?? false) && !postList.isPlaceholderData,
    goToPreviousPage: () => {
      goToPage(page - 1);
    },
    goToNextPage: () => {
      goToPage(page + 1);
    },
    goToFirstPage: () => {
      goToPage(FIRST_PAGE);
    },
    selectPageSize,
  };
};
