import type { Page, PageRequest } from "@/types/pagination";

export const toPageRequest = (page: number, pageSize: number): PageRequest => ({
  skip: (page - 1) * pageSize,
  limit: pageSize + 1,
});

export const toPage = <TItem>(items: TItem[], pageSize: number): Page<TItem> => ({
  items: items.slice(0, pageSize),
  hasNext: items.length > pageSize,
});
