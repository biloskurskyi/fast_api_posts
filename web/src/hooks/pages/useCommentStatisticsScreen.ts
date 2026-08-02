"use client";

import { useState } from "react";

import { useStatisticsQueries } from "@/hooks/queries/useStatisticsQueries";
import { toDailyStatistics } from "@/mappers/statistics.mapper";
import type { StatisticsRange } from "@/types/statistics";
import { utcToday } from "@/utils/dateRange";

export const useCommentStatisticsScreen = () => {
  const latestDate = utcToday();
  const [range, setRange] = useState<StatisticsRange | null>(null);
  const { dailyComments } = useStatisticsQueries(range);

  const rows = dailyComments.data;

  return {
    latestDate,
    isLoading: dailyComments.isFetching,
    statistics:
      range === null || rows === undefined ? null : toDailyStatistics(rows, range),
    error: dailyComments.error,
    showRange: (nextRange: StatisticsRange) => {
      setRange(nextRange);
    },
    invalidateRange: () => {
      setRange(null);
    },
  };
};
