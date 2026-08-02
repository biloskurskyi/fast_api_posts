"use client";

import { usePostEditorScreen } from "@/hooks/pages/usePostEditorScreen";
import { ApiErrorBanner } from "@/parts/feedback/ApiErrorBanner";
import { ForbiddenPanel } from "@/parts/feedback/ForbiddenPanel";
import { PostNotFoundPanel } from "@/parts/feedback/PostNotFoundPanel";
import { SurfaceListSkeleton } from "@/parts/feedback/SurfaceListSkeleton";
import { PostForm } from "@/parts/forms/PostForm";
import { EditorLayout } from "@/parts/layout/EditorLayout";

const SKELETON_CARD_COUNT = 1;
const SKELETON_LINE_COUNT = 8;

export const PostEditorScreen = () => {
  const {
    mode,
    post,
    isFormVisible,
    isLoading,
    isNotFound,
    isForbidden,
    postHref,
    loadError,
    retryLoad,
    isSaving,
    saveError,
    savePost,
    cancelEditing,
  } = usePostEditorScreen();

  return (
    <EditorLayout mode={mode}>
      {isLoading ? (
        <SurfaceListSkeleton
          cardCount={SKELETON_CARD_COUNT}
          lineCount={SKELETON_LINE_COUNT}
        />
      ) : null}
      {isNotFound ? <PostNotFoundPanel /> : null}
      {isForbidden ? <ForbiddenPanel postHref={postHref} /> : null}
      <ApiErrorBanner error={loadError} onRetry={retryLoad} />
      {isFormVisible ? (
        <PostForm
          mode={mode}
          post={post}
          isSaving={isSaving}
          saveError={saveError}
          onSubmit={savePost}
          onCancel={cancelEditing}
        />
      ) : null}
    </EditorLayout>
  );
};
