export const UNRESOLVED_POST_ID = 0;

export const toPostId = (value: string | string[] | undefined): number => {
  const postId = Number(value);
  return Number.isInteger(postId) && postId > 0 ? postId : UNRESOLVED_POST_ID;
};
