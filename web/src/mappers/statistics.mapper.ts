import type {
  DailyCommentsRequest,
  DailyStat,
  DailyStatDto,
  DailyStatistics,
  StatisticsRange,
} from "@/types/statistics";
import { enumerateDays } from "@/utils/dateRange";
import { formatDayLabel } from "@/utils/formatDate";

export const toDailyCommentsRequest = (range: StatisticsRange): DailyCommentsRequest => ({
  date_from: range.dateFrom,
  date_to: range.dateTo,
});

export const toDailyStatistics = (
  dtos: DailyStatDto[],
  range: StatisticsRange,
): DailyStatistics => {
  const reported = new Map(dtos.map((dto) => [dto.date, dto]));

  const days: DailyStat[] = enumerateDays(range.dateFrom, range.dateTo).map((date) => {
    const dto = reported.get(date);
    return {
      date,
      label: formatDayLabel(date),
      total: dto?.total_comments ?? 0,
      blocked: dto?.blocked_comments ?? 0,
    };
  });

  return {
    days,
    summary: {
      totalComments: days.reduce((sum, day) => sum + day.total, 0),
      blockedComments: days.reduce((sum, day) => sum + day.blocked, 0),
      dayCount: days.length,
    },
    maxTotal: days.reduce((highest, day) => Math.max(highest, day.total), 0),
  };
};
