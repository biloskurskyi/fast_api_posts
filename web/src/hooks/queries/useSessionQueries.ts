"use client";

import { useMutation } from "@tanstack/react-query";

import { sessionApi } from "@/api/sessionApi";
import type { ApiError } from "@/errors/apiError.types";
import type { Credentials, SessionDto } from "@/types/session";

export const useSessionQueries = () => {
  const createSession = useMutation<SessionDto, ApiError, Credentials>({
    mutationFn: sessionApi.create,
  });

  return { createSession };
};
