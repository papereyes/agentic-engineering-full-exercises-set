import { describe, expect, it } from "vitest";
import { applyFilterPreset, defaultFilters, savedFilterPresets } from "../../src/utils/filters";

describe("saved filters", () => {
  it("applies High-priority Blocked without replacing the search query", () => {
    const preset = savedFilterPresets.find((candidate) => candidate.id === "high-priority-blocked");

    expect(applyFilterPreset({ ...defaultFilters, query: "atlas" }, preset!)).toEqual({
      query: "atlas",
      priority: "High",
      status: "Blocked",
    });
  });
});
