import { cn, formatAmountForDisplay, formatAmountForStripe } from "~/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("merges tailwind conflicts correctly", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("formatAmountForDisplay", () => {
  it("formats USD correctly", () => {
    const result = formatAmountForDisplay(29.99, "USD");
    expect(result).toBe("$29.99");
  });

  it("formats zero amount", () => {
    const result = formatAmountForDisplay(0, "USD");
    expect(result).toBe("$0.00");
  });

  it("formats large amounts", () => {
    const result = formatAmountForDisplay(1234.56, "USD");
    expect(result).toBe("$1,234.56");
  });

  it("formats EUR correctly", () => {
    const result = formatAmountForDisplay(10, "EUR");
    expect(result).toContain("10");
  });
});

describe("formatAmountForStripe", () => {
  it("converts dollar amounts to cents", () => {
    expect(formatAmountForStripe(29.99, "USD")).toBe(2999);
  });

  it("converts zero to zero", () => {
    expect(formatAmountForStripe(0, "USD")).toBe(0);
  });

  it("handles whole dollar amounts", () => {
    expect(formatAmountForStripe(10, "USD")).toBe(1000);
  });

  it("rounds correctly for floating point", () => {
    expect(formatAmountForStripe(19.99, "USD")).toBe(1999);
  });

  it("handles zero-decimal currencies (JPY)", () => {
    expect(formatAmountForStripe(1000, "JPY")).toBe(1000);
  });
});
