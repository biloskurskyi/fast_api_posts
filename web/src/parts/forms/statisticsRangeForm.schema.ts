import { z } from "zod";

import { LIMITS } from "@/constants/limits";
import type { StatisticsRange } from "@/types/statistics";
import { countRangeDays, utcToday } from "@/utils/dateRange";

export const statisticsRangeFormSchema = z
  .object({
    dateFrom: z.string().min(1, "validation:statisticsDateRequired"),
    dateTo: z.string().min(1, "validation:statisticsDateRequired"),
  })
  .refine((range) => range.dateTo <= utcToday(), {
    message: "validation:statisticsFutureDate",
    path: ["dateTo"],
  })
  .refine((range) => range.dateFrom <= range.dateTo, {
    message: "validation:statisticsDateOrder",
    path: ["dateFrom"],
  })
  .refine(
    (range) =>
      countRangeDays(range.dateFrom, range.dateTo) <= LIMITS.statisticsRangeDays.max,
    { message: "validation:statisticsRangeTooLong", path: ["dateFrom"] },
  );

export type StatisticsRangeFormValues = z.infer<typeof statisticsRangeFormSchema>;

export const createStatisticsRangeFormDefaults = (): StatisticsRange => ({
  dateFrom: "",
  dateTo: "",
});
