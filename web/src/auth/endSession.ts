import { emitSessionExpired } from "./authEvents";
import { clearAccessToken, readAccessToken } from "./tokenStorage";

export const endSession = (): void => {
  if (readAccessToken() === null) return;
  clearAccessToken();
  emitSessionExpired();
};
