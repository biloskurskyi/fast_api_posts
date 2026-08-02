import { ENDPOINTS } from "@/constants/endpoints";
import type { AutoReplySettingsDto } from "@/types/autoReply";

import { httpClient } from "./httpClient";

export const autoReplyApi = {
  get: async (): Promise<AutoReplySettingsDto> => {
    const { data } = await httpClient.get<AutoReplySettingsDto>(
      ENDPOINTS.autoReplySettings,
    );
    return data;
  },
  update: async (settings: AutoReplySettingsDto): Promise<AutoReplySettingsDto> => {
    const { data } = await httpClient.put<AutoReplySettingsDto>(
      ENDPOINTS.autoReplySettings,
      settings,
    );
    return data;
  },
};
