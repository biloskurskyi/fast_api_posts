"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/auth/useAuth";
import { ROUTES } from "@/constants/routes";

type AuthGuardProps = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isSessionResolved } = useAuth();
  const isAllowed = isSessionResolved && isAuthenticated;

  useEffect(() => {
    if (!isSessionResolved || isAuthenticated) return;
    router.replace(ROUTES.signIn);
  }, [isSessionResolved, isAuthenticated, router]);

  return isAllowed ? children : null;
};
