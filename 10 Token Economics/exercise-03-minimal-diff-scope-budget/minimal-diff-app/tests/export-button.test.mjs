import assert from "node:assert/strict";
import test from "node:test";

import { buttonVariantFor } from "../src/migration/exportButton.mjs";

test("migrates only export to the design-system secondary variant", () => {
  const expectedVariants = {
    export: "ds-secondary",
    checkout: "legacy-primary",
    delete: "legacy-danger",
    unknown: "legacy-primary",
  };

  for (const [action, expectedVariant] of Object.entries(expectedVariants)) {
    assert.equal(buttonVariantFor(action), expectedVariant, `${action} keeps its intended button variant`);
  }
});
