"use client";

import { useAutoReplySettingsScreen } from "@/hooks/pages/useAutoReplySettingsScreen";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import { AutoReplySettingsForm } from "@/parts/forms/AutoReplySettingsForm";
import { AutoReplySettingsSkeleton } from "@/parts/forms/AutoReplySettingsSkeleton";
import { SettingsLayout } from "@/parts/layout/SettingsLayout";

export const AutoReplySettingsScreen = () => {
  const {
    settings,
    isLoading,
    loadError,
    reloadSettings,
    isSaving,
    isSaved,
    saveError,
    clearSaveFeedback,
    saveSettings,
  } = useAutoReplySettingsScreen();

  return (
    <SettingsLayout>
      {isLoading ? <AutoReplySettingsSkeleton /> : null}
      <ApiErrorBanner error={loadError} onRetry={reloadSettings} />
      {settings === null ? null : (
        <AutoReplySettingsForm
          settings={settings}
          isSaving={isSaving}
          isSaved={isSaved}
          saveError={saveError}
          onEdit={clearSaveFeedback}
          onSubmit={saveSettings}
        />
      )}
    </SettingsLayout>
  );
};
