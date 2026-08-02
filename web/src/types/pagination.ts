export type PageParams = {
  page: number;
  pageSize: number;
};

export type PageRequest = {
  skip: number;
  limit: number;
};

export type Page<TItem> = {
  items: TItem[];
  hasNext: boolean;
};
