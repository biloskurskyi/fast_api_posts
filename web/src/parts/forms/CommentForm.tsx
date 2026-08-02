"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { CharacterCounter } from "@/components/CharacterCounter";
import { FieldError } from "@/components/FieldError";
import { TextArea } from "@/components/TextArea";
import { LIMITS } from "@/constants/limits";
import { cn } from "@/utils/cn";

import {
  commentFormSchema,
  createCommentFormDefaults,
  type CommentFormValues,
} from "./commentForm.schema";

const TEXTAREA_ROWS = 4;

const SUBMIT_LABEL_KEYS = {
  create: "comments.composer.submit",
  edit: "comments.edit.save",
} as const;

type CommentFormProps = {
  mode: keyof typeof SUBMIT_LABEL_KEYS;
  initialInfo?: string;
  isPending: boolean;
  onSubmit: (values: CommentFormValues) => void;
  onCancel?: () => void;
};

export const CommentForm = ({
  mode,
  initialInfo = "",
  isPending,
  onSubmit,
  onCancel,
}: CommentFormProps) => {
  const { t } = useTranslation("post");
  const fieldId = useId();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: createCommentFormDefaults(initialInfo),
  });

  const info = useWatch({ control, name: "info" });
  const errorMessage = errors.info?.message;
  const infoRegistration = register("info");

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label htmlFor={fieldId} className="sr-only">
        {t("comments.composer.label")}
      </label>
      <TextArea
        id={fieldId}
        rows={TEXTAREA_ROWS}
        placeholder={t("comments.composer.placeholder")}
        isInvalid={errorMessage !== undefined}
        registration={infoRegistration}
      />
      <div
        className={cn(
          "flex flex-wrap items-center gap-3",
          errorMessage === undefined ? "justify-end" : "justify-between",
        )}
      >
        {errorMessage === undefined ? null : (
          <FieldError id={`${fieldId}-message`} message={t(errorMessage)} />
        )}
        <CharacterCounter
          label={t("comments.counter", {
            length: info.length,
            max: LIMITS.commentInfo.max,
          })}
          isOverLimit={info.length > LIMITS.commentInfo.max}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {onCancel === undefined ? null : (
          <Button
            label={t("actions.cancel")}
            type="button"
            variant="secondary"
            isFullWidth={false}
            isDisabled={isPending}
            isBusy={false}
            onClick={onCancel}
          />
        )}
        <Button
          label={t(SUBMIT_LABEL_KEYS[mode])}
          type="submit"
          variant="primary"
          isFullWidth={false}
          isDisabled={!isDirty || isPending}
          isBusy={isPending}
        />
      </div>
    </form>
  );
};
