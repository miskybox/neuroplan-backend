declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;
declare function expect(actual: unknown): {
  toContain(value: string): void;
  not: { toContain(value: string): void };
};

import { cn } from "./utils";

describe("cn utility", () => {
  it("combina clases condicionalmente", () => {
    const showHidden = false;
    const result = cn("btn", ["primary", showHidden && "hidden"], {
      active: true,
      disabled: false,
    });
    expect(result).toContain("btn");
    expect(result).toContain("primary");
    expect(result).toContain("active");
    expect(result).not.toContain("disabled");
    expect(result).not.toContain("hidden");
  });
});
