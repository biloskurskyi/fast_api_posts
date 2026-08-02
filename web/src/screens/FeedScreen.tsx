"use client";

import { useFeedScreen } from "@/hooks/pages/useFeedScreen";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import { FeedLayout } from "@/parts/layout/FeedLayout";
import { PostFeedList } from "@/parts/lists/PostFeedList";
import { PostFeedSkeleton } from "@/parts/lists/PostFeedSkeleton";
import { PaginationControls } from "@/parts/pagination/PaginationControls";

export const FeedScreen = () => {
  const {
    posts,
    isLoading,
    isBusy,
    isListVisible,
    isPastTheEnd,
    hasResults,
    error,
    retry,
    page,
    pageSize,
    hasPrevious,
    hasNext,
    goToPreviousPage,
    goToNextPage,
    goToFirstPage,
    selectPageSize,
  } = useFeedScreen();

  return (
    <FeedLayout>
      {isLoading ? <PostFeedSkeleton /> : null}
      <ApiErrorBanner error={error} onRetry={retry} />
      {isListVisible ? (
        <PostFeedList
          posts={posts}
          isBusy={isBusy}
          isPastTheEnd={isPastTheEnd}
          onBackToFirstPage={goToFirstPage}
        />
      ) : null}
      {hasResults ? (
        <PaginationControls
          page={page}
          pageSize={pageSize}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
          onSelectPageSize={selectPageSize}
        />
      ) : null}
    </FeedLayout>
  );
};
