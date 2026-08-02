"use client";

import { skipToken, useQuery } from "@tanstack/react-query";

import { statisticsApi } from "@/api/statisticsApi";
import type { ApiError } from "@/errors/apiError.types";
import { toDailyCommentsRequest } from "@/mappers/statistics.mapper";
import type { DailyStatDto, StatisticsRange } from "@/types/statistics";

import { statisticsKeys } from "./statisticsKeys";

export const useStatisticsQueries = (range: StatisticsRange | null) => {
  const requestedRange = range;

  const dailyComments = useQuery<DailyStatDto[], ApiError>({
    queryKey: statisticsKeys.daily(requestedRange),
    queryFn:
      requestedRange === null
        ? skipToken
        : () => statisticsApi.dailyComments(toDailyCommentsRequest(requestedRange)),
  });

  return { dailyComments };
};
