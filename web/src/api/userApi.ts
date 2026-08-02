import { ENDPOINTS } from "@/constants/endpoints";
import type { Credentials } from "@/types/session";
import type { UserDto } from "@/types/user";

import { httpClient } from "./httpClient";

export const userApi = {
  create: async (credentials: Credentials): Promise<UserDto> => {
    const { data } = await httpClient.post<UserDto>(ENDPOINTS.users, credentials);
    return data;
  },
};
