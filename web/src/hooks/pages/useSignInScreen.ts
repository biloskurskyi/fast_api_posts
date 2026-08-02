"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/auth/useAuth";
import { ROUTES } from "@/constants/routes";
import { useSessionQueries } from "@/hooks/queries/useSessionQueries";
import { useUserQueries } from "@/hooks/queries/useUserQueries";
import type { AuthMode, Credentials } from "@/types/session";

export const useSignInScreen = () => {
  const router = useRouter();
  const { isAuthenticated, signIn } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const { createSession } = useSessionQueries();
  const { createUser } = useUserQueries();

  useEffect(() => {
    if (!isAuthenticated) return;
    router.replace(ROUTES.feed);
  }, [isAuthenticated, router]);

  const startSession = (credentials: Credentials) => {
    createSession.mutate(credentials, {
      onSuccess: (session) => {
        signIn(session.access_token);
      },
    });
  };

  const submitCredentials = (credentials: Credentials) => {
    if (mode === "signIn") {
      startSession(credentials);
      return;
    }
    createUser.mutate(credentials, { onSuccess: () => startSession(credentials) });
  };

  const selectMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    createUser.reset();
    createSession.reset();
  };

  const error = createUser.error ?? createSession.error;

  return {
    mode,
    selectMode,
    submitCredentials,
    isPending: createUser.isPending || createSession.isPending,
    error,
    fieldErrors: error?.fieldErrors ?? null,
    isAccountDeactivated: error?.code === "inactive_user",
  };
};
