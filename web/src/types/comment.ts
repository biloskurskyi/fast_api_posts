export type CommentDto = {
  id: number;
  info: string;
  post_id: number;
  owner_id: number;
  blocked_at: string | null;
  created_at: string;
};

export type Comment = {
  id: number;
  info: string;
  ownerId: number;
  createdAt: string;
  isMine: boolean;
  isBlocked: boolean;
};

export type CommentWrite = {
  info: string;
};
