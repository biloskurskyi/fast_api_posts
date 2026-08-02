import axios, { type AxiosError } from "axios";

import { decodeAccessToken, isExpired } from "@/auth/accessToken";
import { endSession } from "@/auth/endSession";
import { readAccessToken } from "@/auth/tokenStorage";
import { API_BASE_URL } from "@/constants/endpoints";
import { SESSION_ENDING_ERROR_CODES } from "@/errors/errorCodes";
import { toApiError } from "@/errors/toApiError";

const sessionEndingCodes: readonly string[] = SESSION_ENDING_ERROR_CODES;

export const httpClient = axios.create({ baseURL: API_BASE_URL });

httpClient.interceptors.request.use((config) => {
  const token = readAccessToken();
  if (!token) return config;

  const claims = decodeAccessToken(token);
  if (!claims || isExpired(claims, Date.now())) {
    endSession();
    return config;
  }

  config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = toApiError(error.response?.status, error.response?.data);
    if (sessionEndingCodes.includes(apiError.code)) endSession();
    return Promise.reject(apiError);
  },
);
