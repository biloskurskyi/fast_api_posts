import type { StatisticsRange } from "@/types/statistics";

export const statisticsKeys = {
  all: ["statistics"] as const,
  daily: (range: StatisticsRange | null) =>
    [...statisticsKeys.all, "daily", range] as const,
};
