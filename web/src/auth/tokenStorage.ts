const ACCESS_TOKEN_KEY = "ledger.accessToken";

export const readAccessToken = (): string | null =>
  window.localStorage.getItem(ACCESS_TOKEN_KEY);

export const clearAccessToken = (): void =>
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
