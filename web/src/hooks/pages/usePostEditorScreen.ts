"use client";

import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/auth/useAuth";
import { ROUTES } from "@/constants/routes";
import { usePostCreateQueries } from "@/hooks/queries/usePostCreateQueries";
import { usePostDetailQueries } from "@/hooks/queries/usePostDetailQueries";
import { toPostDetail } from "@/mappers/post.mapper";
import type { PostWrite } from "@/types/post";
import { UNRESOLVED_POST_ID, toPostId } from "@/utils/postId";

export const usePostEditorScreen = () => {
  const router = useRouter();
  const params = useParams();
  const { userId } = useAuth();

  const postId = toPostId(params.postId);
  const isEditing = postId !== UNRESOLVED_POST_ID;
  const { postDetail, updatePost } = usePostDetailQueries({
    postId,
    isEnabled: isEditing,
  });
  const { createPost } = usePostCreateQueries();

  const postDto = postDetail.data ?? null;
  const post = postDto === null ? null : toPostDetail(postDto, userId);
  const isNotFound = isEditing && postDetail.error?.code === "post_not_found";
  const isForbidden = post !== null && !post.isMine;
  const goToPost = (createdPostId: number) => {
    router.replace(ROUTES.post(createdPostId));
  };

  return {
    mode: isEditing ? ("edit" as const) : ("create" as const),
    post,
    isFormVisible: isEditing ? post !== null && !isForbidden : true,
    isLoading: isEditing && postDetail.isPending,
    isNotFound,
    isForbidden,
    postHref: ROUTES.post(postId),
    loadError: isNotFound ? null : postDetail.error,
    retryLoad: () => {
      void postDetail.refetch();
    },
    isSaving: createPost.isPending || updatePost.isPending,
    saveError: createPost.error ?? updatePost.error,
    savePost: (values: PostWrite) => {
      if (isEditing) {
        updatePost.mutate(values, {
          onSuccess: () => {
            goToPost(postId);
          },
        });
        return;
      }
      createPost.mutate(values, {
        onSuccess: (created) => {
          goToPost(created.id);
        },
      });
    },
    cancelEditing: () => {
      router.push(isEditing ? ROUTES.post(postId) : ROUTES.feed);
    },
  };
};
