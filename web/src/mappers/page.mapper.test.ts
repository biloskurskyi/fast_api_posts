import { describe, expect, it } from "vitest";

import { toPage, toPageRequest } from "./page.mapper";

const PAGE_SIZE = 10;

const rows = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index + 1);

describe("toPageRequest", () => {
  it("asks for one row more than the page size", () => {
    expect(toPageRequest(1, PAGE_SIZE)).toEqual({ skip: 0, limit: 11 });
  });

  it("offsets by whole pages", () => {
    expect(toPageRequest(3, PAGE_SIZE)).toEqual({ skip: 20, limit: 11 });
  });

  it("scales the offset with the page size", () => {
    expect(toPageRequest(2, 50)).toEqual({ skip: 50, limit: 51 });
  });
});

describe("toPage", () => {
  it("reports a next page when the sentinel row came back", () => {
    expect(toPage(rows(PAGE_SIZE + 1), PAGE_SIZE)).toEqual({
      items: rows(PAGE_SIZE),
      hasNext: true,
    });
  });

  it("reports no next page on an exactly full final page", () => {
    expect(toPage(rows(PAGE_SIZE), PAGE_SIZE)).toEqual({
      items: rows(PAGE_SIZE),
      hasNext: false,
    });
  });

  it("reports no next page on a partial final page", () => {
    expect(toPage(rows(3), PAGE_SIZE)).toEqual({ items: rows(3), hasNext: false });
  });

  it("reports no next page past the end of the collection", () => {
    expect(toPage([], PAGE_SIZE)).toEqual({ items: [], hasNext: false });
  });

  it("never hands the sentinel row to the caller", () => {
    expect(toPage(rows(PAGE_SIZE + 1), PAGE_SIZE).items).toHaveLength(PAGE_SIZE);
  });
});
