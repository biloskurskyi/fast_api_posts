"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { TextField } from "@/components/TextField";
import type { AuthMode, Credentials } from "@/types/session";

import {
  createCredentialsFormDefaults,
  credentialsFormSchema,
  isCredentialFieldName,
  type CredentialsFormValues,
} from "./credentialsForm.schema";

const USERNAME_ID = "credentials-username";
const PASSWORD_ID = "credentials-password";

type CredentialsFormProps = {
  mode: AuthMode;
  isPending: boolean;
  isBlocked: boolean;
  fieldErrors: Record<string, string> | null;
  onSubmit: (credentials: Credentials) => void;
};

export const CredentialsForm = ({
  mode,
  isPending,
  isBlocked,
  fieldErrors,
  onSubmit,
}: CredentialsFormProps) => {
  const { t } = useTranslation("auth");
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsFormSchema),
    defaultValues: createCredentialsFormDefaults(),
  });

  useEffect(() => {
    clearErrors();
  }, [mode, clearErrors]);

  useEffect(() => {
    if (fieldErrors === null) return;
    const [firstField] = Object.keys(fieldErrors);
    for (const [field, messageKey] of Object.entries(fieldErrors)) {
      if (!isCredentialFieldName(field)) continue;
      setError(
        field,
        { type: "server", message: messageKey },
        { shouldFocus: field === firstField },
      );
    }
  }, [fieldErrors, setError]);

  const usernameError = errors.username?.message;
  const passwordError = errors.password?.message;
  const usernameRegistration = register("username");
  const passwordRegistration = register("password");

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <FormField
        id={USERNAME_ID}
        label={t("fields.username.label")}
        hint={t("fields.username.hint")}
        errorMessage={usernameError && t(usernameError)}
      >
        <TextField
          id={USERNAME_ID}
          type="text"
          autoComplete="username"
          placeholder={t("fields.username.placeholder")}
          isInvalid={usernameError !== undefined}
          isDisabled={isBlocked}
          registration={usernameRegistration}
        />
      </FormField>
      <FormField
        id={PASSWORD_ID}
        label={t("fields.password.label")}
        hint={t("fields.password.hint")}
        errorMessage={passwordError && t(passwordError)}
      >
        <TextField
          id={PASSWORD_ID}
          type="password"
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
          isInvalid={passwordError !== undefined}
          isDisabled={isBlocked}
          registration={passwordRegistration}
        />
      </FormField>
      <Button
        label={t(`${mode}.cta`)}
        type="submit"
        variant="primary"
        isFullWidth
        isDisabled={!isDirty || isPending || isBlocked}
        isBusy={isPending}
      />
    </form>
  );
};
