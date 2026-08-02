import type { Route } from "next";

import { NOTICE_PARAM, NOTICES } from "./notices";

export const ROUTES = {
  feed: "/" satisfies Route,
  feedAfterPostDeleted: `/?${NOTICE_PARAM}=${NOTICES.postDeleted}` satisfies Route,
  post: (postId: number): Route<`/posts/${number}`> => `/posts/${postId}`,
  signIn: "/sign-in" satisfies Route,
  autoReplySettings: "/settings/auto-reply" satisfies Route,
  statistics: "/statistics" satisfies Route,
} as const;
