"use client";

import { useQuery } from "@tanstack/react-query";

import { healthApi } from "@/api/healthApi";
import type { ServerStatus } from "@/types/health";

import { healthKeys } from "./healthKeys";

const HEALTH_POLL_INTERVAL_MS = 30_000;

export const useHealthQueries = () => {
  const { isSuccess, isError } = useQuery({
    queryKey: healthKeys.all,
    queryFn: healthApi.check,
    refetchInterval: HEALTH_POLL_INTERVAL_MS,
    staleTime: 0,
  });

  const serverStatus: ServerStatus = isSuccess ? "ok" : isError ? "down" : "unknown";

  return { serverStatus };
};
