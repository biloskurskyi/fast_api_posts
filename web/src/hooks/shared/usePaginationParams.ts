"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { FIRST_PAGE } from "@/constants/pagination";

type PaginationParamsOptions = {
  pageKey: string;
  defaultPageSize: number;
  sizeKey?: string;
  pageSizes?: readonly number[];
};

const toPageNumber = (value: string | null): number => {
  const page = Number(value);
  return Number.isInteger(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
};

const toQueryHref = (params: URLSearchParams): `?${string}` => `?${params.toString()}`;

export const usePaginationParams = ({
  pageKey,
  defaultPageSize,
  sizeKey,
  pageSizes,
}: PaginationParamsOptions) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedPageSize =
    sizeKey === undefined ? Number.NaN : Number(searchParams.get(sizeKey));
  const pageSize = pageSizes?.includes(requestedPageSize)
    ? requestedPageSize
    : defaultPageSize;
  const page = toPageNumber(searchParams.get(pageKey));

  const replaceParams = (nextPage: number, nextPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageKey, String(nextPage));
    if (sizeKey !== undefined) params.set(sizeKey, String(nextPageSize));
    router.replace(toQueryHref(params), { scroll: false });
  };

  return {
    page,
    pageSize,
    goToPage: (nextPage: number) => {
      replaceParams(nextPage, pageSize);
    },
    selectPageSize: (nextPageSize: number) => {
      replaceParams(FIRST_PAGE, nextPageSize);
    },
  };
};
