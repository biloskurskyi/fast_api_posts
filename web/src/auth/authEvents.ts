const SESSION_EXPIRED_EVENT = "ledger:session-expired";

export const emitSessionExpired = (): void => {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};

export const subscribeToSessionExpired = (
  onSessionExpired: () => void,
): (() => void) => {
  window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
};
