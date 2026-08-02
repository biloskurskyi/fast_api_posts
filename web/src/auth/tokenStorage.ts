const ACCESS_TOKEN_KEY = "ledger.accessToken";

const TOKEN_CHANGE_EVENT = "ledger:token-change";

export const readAccessToken = (): string | null =>
  window.localStorage.getItem(ACCESS_TOKEN_KEY);

export const writeAccessToken = (token: string): void => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
};

export const clearAccessToken = (): void => {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
};

export const subscribeToAccessToken = (onTokenChange: () => void): (() => void) => {
  window.addEventListener(TOKEN_CHANGE_EVENT, onTokenChange);
  return () => window.removeEventListener(TOKEN_CHANGE_EVENT, onTokenChange);
};
