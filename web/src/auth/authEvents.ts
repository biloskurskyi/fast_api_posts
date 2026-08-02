const SESSION_EXPIRED_EVENT = "ledger:session-expired";

export const emitSessionExpired = (): void => {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};
