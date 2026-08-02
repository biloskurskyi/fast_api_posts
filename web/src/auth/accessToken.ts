import { jwtDecode } from "jwt-decode";
import { z } from "zod";

import type { AccessTokenClaims } from "./auth.types";

const claimsSchema = z.object({
  sub: z.string().regex(/^\d+$/),
  exp: z.number().int(),
});

export const decodeAccessToken = (token: string): AccessTokenClaims | null => {
  const claims = claimsSchema.safeParse(decodeQuietly(token));
  if (!claims.success) return null;
  return { userId: Number(claims.data.sub), expiresAt: claims.data.exp };
};

export const isExpired = (claims: AccessTokenClaims, now: number): boolean =>
  claims.expiresAt * 1000 <= now;

const decodeQuietly = (token: string): unknown => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};
