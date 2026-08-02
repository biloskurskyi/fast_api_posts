"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { CharacterCounter } from "@/components/CharacterCounter";
import { FormField } from "@/components/FormField";
import { Surface } from "@/components/Surface";
import { SwitchField } from "@/components/SwitchField";
import { TextArea } from "@/components/TextArea";
import { LIMITS } from "@/constants/limits";
import type { ApiError } from "@/errors/apiError.types";
import { toDelayPhrase } from "@/mappers/autoReply.mapper";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import type { AutoReplySettings } from "@/types/autoReply";
import { cn } from "@/utils/cn";

import { AutoReplyDelayField } from "./AutoReplyDelayField";
import {
  autoReplySettingsFormSchema,
  createAutoReplyFormDefaults,
  type AutoReplyFormValues,
} from "./autoReplySettingsForm.schema";

const ENABLED_ID = "auto-reply-enabled";
const TEXT_ID = "auto-reply-text";
const DELAY_ID = "auto-reply-delay";
const TEXT_ROW_COUNT = 4;

type AutoReplySettingsFormProps = {
  settings: AutoReplySettings;
  isSaving: boolean;
  isSaved: boolean;
  saveError: ApiError | null;
  onEdit: () => void;
  onSubmit: (values: AutoReplySettings) => void;
};

export const AutoReplySettingsForm = ({
  settings,
  isSaving,
  isSaved,
  saveError,
  onEdit,
  onSubmit,
}: AutoReplySettingsFormProps) => {
  const { t } = useTranslation("settings");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AutoReplyFormValues>({
    resolver: zodResolver(autoReplySettingsFormSchema),
    defaultValues: createAutoReplyFormDefaults(settings),
  });

  const isEnabled = useWatch({ control, name: "isEnabled" });
  const text = useWatch({ control, name: "text" });
  const delaySeconds = useWatch({ control, name: "delaySeconds" });

  const textError = errors.text?.message;
  const textRegistration = register("text", { onChange: onEdit });
  const delayPhrase = toDelayPhrase(delaySeconds);
  const delayPhraseLabel = t(`delay.${delayPhrase.key}`, {
    count: delayPhrase.count,
    hours: delayPhrase.hours,
    minutes: delayPhrase.minutes,
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <Surface>
        <div className="flex flex-col gap-3">
          <Controller
            control={control}
            name="isEnabled"
            render={({ field }) => (
              <SwitchField
                id={ENABLED_ID}
                label={t("fields.enabled.label")}
                isChecked={field.value}
                isDisabled={isSaving}
                onCheckedChange={(isChecked) => {
                  field.onChange(isChecked);
                  onEdit();
                }}
              />
            )}
          />
          <p className="text-secondary text-meta">
            {isEnabled ? t("state.on", { phrase: delayPhraseLabel }) : t("state.off")}
          </p>
        </div>
      </Surface>

      <Surface>
        <fieldset
          disabled={!isEnabled || isSaving}
          className={cn("flex flex-col gap-6", !isEnabled && "opacity-45")}
        >
          <FormField
            id={TEXT_ID}
            label={t("fields.text.label")}
            errorMessage={textError === undefined ? undefined : t(textError)}
          >
            <TextArea
              id={TEXT_ID}
              rows={TEXT_ROW_COUNT}
              placeholder={t("fields.text.placeholder")}
              isInvalid={textError !== undefined}
              registration={textRegistration}
            />
            <CharacterCounter
              label={t("fields.text.counter", {
                current: text.length,
                max: LIMITS.autoReplyText.max,
              })}
              isOverLimit={text.length > LIMITS.autoReplyText.max}
            />
          </FormField>
          <Controller
            control={control}
            name="delaySeconds"
            render={({ field }) => (
              <AutoReplyDelayField
                id={DELAY_ID}
                delaySeconds={field.value}
                phraseLabel={delayPhraseLabel}
                onDelayChange={(seconds) => {
                  field.onChange(seconds);
                  onEdit();
                }}
              />
            )}
          />
        </fieldset>
      </Surface>

      <div className="flex flex-col gap-3">
        <Button
          label={t("actions.save")}
          type="submit"
          variant="primary"
          isFullWidth={false}
          isDisabled={!isDirty || isSaving}
          isBusy={isSaving}
        />
        {isSaved ? (
          <p role="status" className="text-secondary text-meta">
            {t("feedback.saved")}
          </p>
        ) : null}
        <ApiErrorBanner error={saveError} />
      </div>
    </form>
  );
};
