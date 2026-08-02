export type AccessTokenClaims = {
  userId: number;
  expiresAt: number;
};

export type AuthContextValue = {
  userId: number | null;
  isAuthenticated: boolean;
  hasSessionExpiredNotice: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
  dismissSessionExpiredNotice: () => void;
};
