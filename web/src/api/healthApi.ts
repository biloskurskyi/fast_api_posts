import { ENDPOINTS } from "@/constants/endpoints";
import type { HealthDto } from "@/types/health";

import { httpClient } from "./httpClient";

export const healthApi = {
  check: async (): Promise<HealthDto> => {
    const { data } = await httpClient.get<HealthDto>(ENDPOINTS.health);
    return data;
  },
};
