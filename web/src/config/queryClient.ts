import { isServer, QueryClient } from "@tanstack/react-query";

const DEFAULT_STALE_TIME_MS = 60_000;

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { staleTime: DEFAULT_STALE_TIME_MS, retry: false },
    },
  });

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};
