"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { FIRST_PAGE } from "@/constants/pagination";

type PaginationParamsOptions = {
  pageKey: string;
  sizeKey: string;
  pageSizes: readonly number[];
  defaultPageSize: number;
};

const toPageNumber = (value: string | null): number => {
  const page = Number(value);
  return Number.isInteger(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
};

const toQueryHref = (params: URLSearchParams): `?${string}` => `?${params.toString()}`;

export const usePaginationParams = ({
  pageKey,
  sizeKey,
  pageSizes,
  defaultPageSize,
}: PaginationParamsOptions) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedPageSize = Number(searchParams.get(sizeKey));
  const pageSize = pageSizes.includes(requestedPageSize)
    ? requestedPageSize
    : defaultPageSize;
  const page = toPageNumber(searchParams.get(pageKey));

  const replaceParams = (nextPage: number, nextPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageKey, String(nextPage));
    params.set(sizeKey, String(nextPageSize));
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
