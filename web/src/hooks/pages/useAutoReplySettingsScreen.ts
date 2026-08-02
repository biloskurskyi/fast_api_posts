"use client";

import { useAutoReplyQueries } from "@/hooks/queries/useAutoReplyQueries";
import {
  toAutoReplySettings,
  toAutoReplySettingsDto,
} from "@/mappers/autoReply.mapper";
import type { AutoReplySettings } from "@/types/autoReply";

export const useAutoReplySettingsScreen = () => {
  const { settingsQuery, updateSettings } = useAutoReplyQueries();

  const settings =
    settingsQuery.data === undefined ? null : toAutoReplySettings(settingsQuery.data);

  return {
    settings,
    isLoading: settingsQuery.isPending,
    loadError: settingsQuery.error,
    reloadSettings: () => {
      void settingsQuery.refetch();
    },
    isSaving: updateSettings.isPending,
    isSaved: updateSettings.isSuccess,
    saveError: updateSettings.error,
    clearSaveFeedback: () => {
      if (updateSettings.isIdle) return;
      updateSettings.reset();
    },
    saveSettings: (values: AutoReplySettings) => {
      updateSettings.mutate(toAutoReplySettingsDto(values));
    },
  };
};
