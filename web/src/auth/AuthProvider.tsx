"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { ROUTES } from "@/constants/routes";

import { decodeAccessToken } from "./accessToken";
import { AuthContext } from "./authContext";
import { subscribeToSessionExpired } from "./authEvents";
import { endSession } from "./endSession";
import {
  clearAccessToken,
  readAccessToken,
  subscribeToAccessToken,
  writeAccessToken,
} from "./tokenStorage";

type AuthProviderProps = {
  children: ReactNode;
};

const readServerAccessToken = (): string | null => null;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hasSessionExpiredNotice, setHasSessionExpiredNotice] = useState(false);

  const token = useSyncExternalStore(
    subscribeToAccessToken,
    readAccessToken,
    readServerAccessToken,
  );
  const claims = token === null ? null : decodeAccessToken(token);
  const expiresAt = claims?.expiresAt ?? null;

  useEffect(
    () =>
      subscribeToSessionExpired(() => {
        queryClient.clear();
        setHasSessionExpiredNotice(true);
      }),
    [queryClient],
  );

  useEffect(() => {
    if (expiresAt === null) return;
    const msUntilExpiry = Math.max(expiresAt * 1000 - Date.now(), 0);
    const timer = setTimeout(endSession, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [expiresAt]);

  const signIn = (nextToken: string) => {
    setHasSessionExpiredNotice(false);
    writeAccessToken(nextToken);
  };

  const signOut = () => {
    clearAccessToken();
    queryClient.clear();
    router.replace(ROUTES.signIn);
  };

  const dismissSessionExpiredNotice = () => {
    setHasSessionExpiredNotice(false);
  };

  return (
    <AuthContext
      value={{
        userId: claims?.userId ?? null,
        isAuthenticated: claims !== null,
        hasSessionExpiredNotice,
        signIn,
        signOut,
        dismissSessionExpiredNotice,
      }}
    >
      {children}
    </AuthContext>
  );
};
