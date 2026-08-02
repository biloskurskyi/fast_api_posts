export const NOTICE_PARAM = "notice";

export const NOTICES = {
  postDeleted: "post-deleted",
} as const;

export const NOTICE_MESSAGE_KEYS: Record<string, string> = {
  [NOTICES.postDeleted]: "notices.postDeleted",
};
