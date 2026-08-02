import { describe, expect, it } from "vitest";

import { byteLength } from "./byteLength";

describe("byteLength", () => {
  it("counts one byte per ascii character", () => {
    expect(byteLength("a".repeat(72))).toBe(72);
  });

  it("counts an empty string as zero", () => {
    expect(byteLength("")).toBe(0);
  });

  it("counts a four-byte emoji as four bytes", () => {
    expect(byteLength("🙂")).toBe(4);
  });

  it("counts two bytes for a latin-1 supplement character", () => {
    expect(byteLength("é")).toBe(2);
  });

  it("counts three bytes for a cyrillic-free cjk character", () => {
    expect(byteLength("漢")).toBe(3);
  });

  it("puts 18 emoji exactly on the 72-byte boundary", () => {
    expect(byteLength("🙂".repeat(18))).toBe(72);
  });

  it("puts 19 emoji past the 72-byte boundary while under 72 characters", () => {
    const value = "🙂".repeat(19);
    expect(value.length).toBeLessThanOrEqual(72);
    expect(byteLength(value)).toBe(76);
  });
});
