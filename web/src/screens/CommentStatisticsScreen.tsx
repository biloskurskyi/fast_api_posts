"use client";

import { useCommentStatisticsScreen } from "@/hooks/pages/useCommentStatisticsScreen";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import { StatisticsRangeForm } from "@/parts/forms/StatisticsRangeForm";
import { StatisticsLayout } from "@/parts/layout/StatisticsLayout";
import { DailyStatisticsResults } from "@/parts/tables/DailyStatisticsResults";

export const CommentStatisticsScreen = () => {
  const { latestDate, isLoading, statistics, error, showRange, invalidateRange } =
    useCommentStatisticsScreen();

  return (
    <StatisticsLayout>
      <StatisticsRangeForm
        latestDate={latestDate}
        isPending={isLoading}
        onSubmit={showRange}
        onEdit={invalidateRange}
      />
      <ApiErrorBanner error={error} />
      <DailyStatisticsResults statistics={statistics} isLoading={isLoading} />
    </StatisticsLayout>
  );
};
