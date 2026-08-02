export const FEED_EXCERPT_MAX_LENGTH = 150;

export const LIMITS = {
  username: { min: 3, max: 50, pattern: /^[A-Za-z0-9_.-]+$/ },
  password: { min: 8, max: 72, maxBytes: 72 },
  postTitle: { min: 1, max: 200 },
  postContent: { min: 1, max: 10000 },
  commentInfo: { min: 1, max: 2000 },
  autoReplyText: { max: 500 },
  autoReplyDelaySeconds: { min: 0, max: 86400 },
  statisticsRangeDays: { max: 90 },
} as const;
