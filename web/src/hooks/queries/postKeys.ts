import type { PageParams } from "@/types/pagination";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (params: PageParams) => [...postKeys.lists(), params] as const,
};
