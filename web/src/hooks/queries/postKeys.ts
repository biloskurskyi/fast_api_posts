import type { PageParams } from "@/types/pagination";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (params: PageParams) => [...postKeys.lists(), params] as const,
  detail: (postId: number) => [...postKeys.all, "detail", postId] as const,
  comments: (postId: number) => [...postKeys.detail(postId), "comments"] as const,
  commentPage: (postId: number, params: PageParams) =>
    [...postKeys.comments(postId), params] as const,
};
