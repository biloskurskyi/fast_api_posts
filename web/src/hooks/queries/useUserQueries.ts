"use client";

import { useMutation } from "@tanstack/react-query";

import { userApi } from "@/api/userApi";
import type { ApiError } from "@/errors/apiError.types";
import type { Credentials } from "@/types/session";
import type { UserDto } from "@/types/user";

export const useUserQueries = () => {
  const createUser = useMutation<UserDto, ApiError, Credentials>({
    mutationFn: userApi.create,
  });

  return { createUser };
};
