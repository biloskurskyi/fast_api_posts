import type { Route } from "next";

export const ROUTES = {
  feed: "/" satisfies Route,
  signIn: "/sign-in" satisfies Route,
} as const;
