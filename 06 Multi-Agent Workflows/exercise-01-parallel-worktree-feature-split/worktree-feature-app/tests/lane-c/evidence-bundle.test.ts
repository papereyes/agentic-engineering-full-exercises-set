import { describe, expect, it } from "vitest";
import { workItems } from "../../src/data/workItems";
import { createEvidenceBundle, serializeEvidenceBundle } from "../../src/services/workflowApi";

describe("evidence bundles", () => {
  it("serializes caller-timestamped evidence in a stable field order", () => {
    const bundle = createEvidenceBundle(workItems[0], ["Policy approval attached"], "2026-08-13T09:00:00.000Z");

    expect(serializeEvidenceBundle(bundle)).toBe(
      '{"id":"parall-01","owner":"Asha","status":"Blocked","risk":100,"evidence":["Policy approval attached"],"generatedAt":"2026-08-13T09:00:00.000Z"}',
    );
  });
});
