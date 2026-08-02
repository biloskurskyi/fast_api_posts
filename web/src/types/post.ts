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
