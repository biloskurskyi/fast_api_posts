import { describe, expect, it } from "vitest";

import { parseValidationMessage } from "./validationError.mapper";

const SERVER_REJECTED_KEY = "validation:serverRejected";

describe("parseValidationMessage", () => {
  it("reads a single field error and drops the source segment", () => {
    expect(
      parseValidationMessage("body.username: String should have at least 3 characters"),
    ).toEqual({ fieldErrors: { username: SERVER_REJECTED_KEY }, formError: null });
  });

  it("reads every field of a multi-error message", () => {
    expect(
      parseValidationMessage(
        "body.username: String should match pattern '^[A-Za-z0-9_.-]+$'; body.password: String should have at least 8 characters",
      ),
    ).toEqual({
      fieldErrors: {
        username: SERVER_REJECTED_KEY,
        password: SERVER_REJECTED_KEY,
      },
      formError: null,
    });
  });

  it("treats a single-segment body loc as form-level", () => {
    expect(
      parseValidationMessage(
        "body: Value error, auto_reply_text must not be empty when auto-reply is enabled",
      ),
    ).toEqual({ fieldErrors: null, formError: SERVER_REJECTED_KEY });
  });

  it("treats a single-segment query loc as form-level", () => {
    expect(
      parseValidationMessage("query: Value error, date_to must not be in the future"),
    ).toEqual({ fieldErrors: null, formError: SERVER_REJECTED_KEY });
  });

  it("keeps a field name that carries the Value error prefix", () => {
    expect(
      parseValidationMessage("body.password: Value error, password must not exceed 72 bytes"),
    ).toEqual({ fieldErrors: { password: SERVER_REJECTED_KEY }, formError: null });
  });

  it("treats a single segment without the Value error prefix as form-level", () => {
    expect(
      parseValidationMessage(
        "body: Input should be a valid dictionary or object to extract fields from",
      ),
    ).toEqual({ fieldErrors: null, formError: SERVER_REJECTED_KEY });
  });

  it("reads query and path locs the same way as body", () => {
    expect(
      parseValidationMessage(
        "query.limit: Input should be less than or equal to 100; path.post_id: Input should be greater than or equal to 1",
      ),
    ).toEqual({
      fieldErrors: {
        limit: SERVER_REJECTED_KEY,
        post_id: SERVER_REJECTED_KEY,
      },
      formError: null,
    });
  });

  it("mixes a field error and a form-level error in one message", () => {
    expect(
      parseValidationMessage("body.username: Field required; body: Value error, bad shape"),
    ).toEqual({
      fieldErrors: { username: SERVER_REJECTED_KEY },
      formError: SERVER_REJECTED_KEY,
    });
  });

  it("falls back to a form-level error on an unparseable message", () => {
    expect(parseValidationMessage("something went wrong")).toEqual({
      fieldErrors: null,
      formError: SERVER_REJECTED_KEY,
    });
  });

  it("falls back to a form-level error on an empty message", () => {
    expect(parseValidationMessage("")).toEqual({
      fieldErrors: null,
      formError: SERVER_REJECTED_KEY,
    });
  });
});
