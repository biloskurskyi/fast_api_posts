import { describe, expect, it } from "vitest";

import { decodeAccessToken, isExpired } from "./accessToken";

const encodeSegment = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

const makeToken = (payload: object) =>
  `${encodeSegment({ alg: "HS256", typ: "JWT" })}.${encodeSegment(payload)}.signature`;

describe("decodeAccessToken", () => {
  it("reads the stringified sub as a numeric user id", () => {
    expect(decodeAccessToken(makeToken({ sub: "20", exp: 1785680574 }))).toEqual({
      userId: 20,
      expiresAt: 1785680574,
    });
  });

  it("rejects a malformed token", () => {
    expect(decodeAccessToken("not-a-jwt")).toBeNull();
  });

  it("rejects a token without sub", () => {
    expect(decodeAccessToken(makeToken({ exp: 1785680574 }))).toBeNull();
  });

  it("rejects a token without exp", () => {
    expect(decodeAccessToken(makeToken({ sub: "20" }))).toBeNull();
  });

  it("rejects a non-numeric sub", () => {
    expect(decodeAccessToken(makeToken({ sub: "alice", exp: 1785680574 }))).toBeNull();
  });
});

describe("isExpired", () => {
  const now = 1_785_680_000_000;

  it("treats a token expiring in one second as live", () => {
    expect(isExpired({ userId: 20, expiresAt: now / 1000 + 1 }, now)).toBe(false);
  });

  it("treats a token expiring exactly now as expired", () => {
    expect(isExpired({ userId: 20, expiresAt: now / 1000 }, now)).toBe(true);
  });

  it("treats a past expiry as expired", () => {
    expect(isExpired({ userId: 20, expiresAt: now / 1000 - 1 }, now)).toBe(true);
  });
});
