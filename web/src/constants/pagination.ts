export const FIRST_PAGE = 1;

export const FEED_PAGE_SIZES = [10, 20, 50] as const;

export const FEED_PAGINATION = {
  pageKey: "page",
  sizeKey: "size",
  pageSizes: FEED_PAGE_SIZES,
  defaultPageSize: 10,
} as const;

export const COMMENT_THREAD_PAGE_SIZE = 20;

export const COMMENT_THREAD_PAGINATION = {
  pageKey: "commentsPage",
  defaultPageSize: COMMENT_THREAD_PAGE_SIZE,
} as const;
