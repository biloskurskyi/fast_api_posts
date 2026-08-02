export type PostDto = {
  id: number;
  title: string;
  content: string;
  owner_id: number;
};

export type Post = {
  id: number;
  title: string;
  ownerId: number;
  excerpt: string;
};

export type PostDetail = {
  id: number;
  title: string;
  content: string;
  ownerId: number;
  isMine: boolean;
};

export type PostWrite = {
  title: string;
  content: string;
};

export type PostEditorMode = "create" | "edit";
