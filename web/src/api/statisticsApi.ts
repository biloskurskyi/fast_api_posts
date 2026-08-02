import { ENDPOINTS } from "@/constants/endpoints";
import type { DailyCommentsRequest, DailyStatDto } from "@/types/statistics";

import { httpClient } from "./httpClient";

export const statisticsApi = {
  dailyComments: async (request: DailyCommentsRequest): Promise<DailyStatDto[]> => {
    const { data } = await httpClient.get<DailyStatDto[]>(ENDPOINTS.dailyComments, {
      params: request,
    });
    return data;
  },
};
