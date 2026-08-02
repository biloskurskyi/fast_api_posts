"use client";

import { useContext } from "react";

import type { AuthContextValue } from "./auth.types";
import { AuthContext } from "./authContext";

export const useAuth = (): AuthContextValue => {
  const auth = useContext(AuthContext);
  if (auth === null) throw new Error("useAuth requires an AuthProvider ancestor");
  return auth;
};
