import { describe, expect, it } from "vitest";

import { capitalise } from "./text.util";

describe("capitalise", () => {
  it("uppercases the first character", () => {
    expect(capitalise("broken clouds")).toBe("Broken clouds");
  });

  it("leaves already-capitalised strings unchanged", () => {
    expect(capitalise("Clear")).toBe("Clear");
  });

  it("returns the input for empty strings", () => {
    expect(capitalise("")).toBe("");
  });

  it("handles single-character input", () => {
    expect(capitalise("a")).toBe("A");
  });
});
