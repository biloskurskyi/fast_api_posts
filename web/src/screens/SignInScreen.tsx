"use client";

import { useSignInScreen } from "@/hooks/pages/useSignInScreen";
import { AuthPanel } from "@/parts/auth/AuthPanel";
import { AuthTabs } from "@/parts/auth/AuthTabs";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import { CredentialsForm } from "@/parts/forms/CredentialsForm";

export const SignInScreen = () => {
  const {
    mode,
    selectMode,
    submitCredentials,
    isPending,
    error,
    fieldErrors,
    isAccountDeactivated,
  } = useSignInScreen();

  return (
    <AuthPanel mode={mode}>
      <AuthTabs mode={mode} onSelect={selectMode} />
      <ApiErrorBanner error={error} />
      <CredentialsForm
        mode={mode}
        isPending={isPending}
        isBlocked={isAccountDeactivated}
        fieldErrors={fieldErrors}
        onSubmit={submitCredentials}
      />
    </AuthPanel>
  );
};
