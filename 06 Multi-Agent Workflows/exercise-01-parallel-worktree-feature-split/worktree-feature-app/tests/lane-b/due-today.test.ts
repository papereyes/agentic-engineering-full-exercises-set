import { describe, expect, it } from "vitest";
import { workItems } from "../../src/data/workItems";
import { summarizePortfolio } from "../../src/utils/scoring";

describe("summarizePortfolio", () => {
  it("counts every item due exactly today", () => {
    expect(
      summarizePortfolio([
        ...workItems,
        { ...workItems[1], id: "due-today-ready", dueInDays: 0 },
        { ...workItems[2], id: "overdue", dueInDays: -1 },
      ]).dueToday,
    ).toBe(2);
  });
});
