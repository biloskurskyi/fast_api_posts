"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { CharacterCounter } from "@/components/CharacterCounter";
import { FormField } from "@/components/FormField";
import { Surface } from "@/components/Surface";
import { TextArea } from "@/components/TextArea";
import { TextField } from "@/components/TextField";
import { LIMITS } from "@/constants/limits";
import type { ApiError } from "@/errors/apiError.types";
import { mapPostToFormData } from "@/mappers/post.mapper";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import type { PostDetail, PostEditorMode, PostWrite } from "@/types/post";

import { postFormSchema, type PostFormValues } from "./postForm.schema";

const TITLE_ID = "post-title";
const CONTENT_ID = "post-content";
const CONTENT_ROW_COUNT = 14;

type PostFormProps = {
  mode: PostEditorMode;
  post: PostDetail | null;
  isSaving: boolean;
  saveError: ApiError | null;
  onSubmit: (values: PostWrite) => void;
  onCancel: () => void;
};

export const PostForm = ({
  mode,
  post,
  isSaving,
  saveError,
  onSubmit,
  onCancel,
}: PostFormProps) => {
  const { t } = useTranslation("editor");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: mapPostToFormData(post),
  });

  const title = useWatch({ control, name: "title" });
  const content = useWatch({ control, name: "content" });
  const titleError = errors.title?.message;
  const contentError = errors.content?.message;
  const titleRegistration = register("title");
  const contentRegistration = register("content");

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Surface>
        <div className="flex flex-col gap-6">
          <FormField
            id={TITLE_ID}
            label={t("fields.title.label")}
            errorMessage={titleError === undefined ? undefined : t(titleError)}
          >
            <TextField
              id={TITLE_ID}
              type="text"
              variant="title"
              autoComplete="off"
              placeholder={t("fields.title.placeholder")}
              isInvalid={titleError !== undefined}
              isDisabled={isSaving}
              registration={titleRegistration}
            />
            <CharacterCounter
              label={t("counter", { current: title.length, max: LIMITS.postTitle.max })}
              isOverLimit={title.length > LIMITS.postTitle.max}
            />
          </FormField>
          <FormField
            id={CONTENT_ID}
            label={t("fields.body.label")}
            errorMessage={contentError === undefined ? undefined : t(contentError)}
          >
            <TextArea
              id={CONTENT_ID}
              rows={CONTENT_ROW_COUNT}
              placeholder={t("fields.body.placeholder")}
              isInvalid={contentError !== undefined}
              registration={contentRegistration}
            />
            <CharacterCounter
              label={t("counter", {
                current: content.length,
                max: LIMITS.postContent.max,
              })}
              isOverLimit={content.length > LIMITS.postContent.max}
            />
          </FormField>
        </div>
      </Surface>
      <ApiErrorBanner error={saveError} />
      <div className="flex flex-col-reverse gap-3 md:flex-row">
        <Button
          label={t("actions.cancel")}
          type="button"
          variant="secondary"
          isFullWidth={false}
          isDisabled={isSaving}
          isBusy={false}
          onClick={onCancel}
        />
        <Button
          label={t(`${mode}.cta`)}
          type="submit"
          variant="primary"
          isFullWidth={false}
          isDisabled={!isDirty || isSaving}
          isBusy={isSaving}
        />
      </div>
    </form>
  );
};
