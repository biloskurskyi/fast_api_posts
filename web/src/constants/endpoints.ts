export const API_BASE_URL = "/api";

export const ENDPOINTS = {
  health: "/health",
  users: "/users",
  sessions: "/sessions",
  autoReplySettings: "/users/me/auto-reply-settings",
  posts: "/posts",
  post: (postId: number) => `/posts/${postId}`,
  postComments: (postId: number) => `/posts/${postId}/comments`,
  comment: (commentId: number) => `/comments/${commentId}`,
  dailyComments: "/statistics/daily-comments",
} as const;
