import { ENDPOINTS } from "@/constants/endpoints";
import type { Credentials, SessionDto } from "@/types/session";

import { httpClient } from "./httpClient";

export const sessionApi = {
  create: async ({ username, password }: Credentials): Promise<SessionDto> => {
    const form = new URLSearchParams({ username, password });
    const { data } = await httpClient.post<SessionDto>(ENDPOINTS.sessions, form);
    return data;
  },
};
