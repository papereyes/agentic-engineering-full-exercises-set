// Manual regression check for the quality-gate CLI's exception handling.
// Not wired into `npm test` because package.json and test-quality-verifier.mjs
// are protected inputs (challenge-integrity.json). Run directly:
//   node ./scripts/test-quality-gate-cli.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "quality-gate-cli-test-"));
try {
  const lighthouseDir = path.join(temporary, "lighthouse");
  fs.mkdirSync(lighthouseDir);
  const contract = {
    schemaVersion: 1,
    route: "/",
    lighthouseRuns: 3,
    aggregation: "pessimistic",
    captureEnvironment: { formFactor: "mobile", throttlingMethod: "simulate", screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false } },
    thresholds: { minimumPerformance: 0.9, minimumAccessibility: 1, maximumLargestContentfulPaintMs: 2500, maximumAxeViolations: 0 },
  };
  const contractPath = path.join(temporary, "contract.json");
  fs.writeFileSync(contractPath, JSON.stringify(contract));
  function report(index, performance, lcp) {
    return {
      lighthouseVersion: "12.0.0",
      fetchTime: `2026-08-14T10:30:0${index}.000Z`,
      finalUrl: "http://localhost:4010/",
      categories: { performance: { score: performance }, accessibility: { score: 1 } },
      audits: { "largest-contentful-paint": { numericValue: lcp } },
      environment: { hostUserAgent: "Chrome/140.0", networkUserAgent: "Chrome/140.0" },
      configSettings: { formFactor: "mobile", throttlingMethod: "simulate", screenEmulation: contract.captureEnvironment.screenEmulation },
    };
  }
  [report(1, 0.94, 2100), report(2, 0.92, 2300), report(3, 0.91, 2400)].forEach((document, index) => {
    fs.writeFileSync(path.join(lighthouseDir, `run-${index + 1}.json`), JSON.stringify(document));
  });
  const sha = "a".repeat(40);

  // Malformed axe evidence: valid JSON, but not an object (property access throws downstream).
  const axePath = path.join(temporary, "axe.json");
  fs.writeFileSync(axePath, "null");

  const cliPath = path.join(import.meta.dirname, "quality-gate.mjs");
  function runGate(outputPath) {
    return execFileSync(
      "node",
      [cliPath, "--lighthouse-dir", lighthouseDir, "--axe", axePath, "--contract", contractPath, "--sha", sha, "--output", outputPath],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  }

  // Case 1: fresh output, no pre-existing summary.
  const freshOutput = path.join(temporary, "fresh-summary.json");
  assert.throws(() => runGate(freshOutput), /Command failed/);
  assert.ok(fs.existsSync(freshOutput), "gate must write a summary even when axe evidence is malformed");
  const freshSummary = JSON.parse(fs.readFileSync(freshOutput, "utf8"));
  assert.equal(freshSummary.releaseDecision, "failed");
  assert.ok(freshSummary.failures.some((f) => f.includes("axe evidence could not be read")));

  // Case 2: an existing passing summary must not be left stale after a bad run.
  const staleOutput = path.join(temporary, "stale-summary.json");
  fs.writeFileSync(staleOutput, JSON.stringify({ releaseDecision: "passed" }));
  assert.throws(() => runGate(staleOutput), /Command failed/);
  const overwritten = JSON.parse(fs.readFileSync(staleOutput, "utf8"));
  assert.equal(overwritten.releaseDecision, "failed");

  console.log("quality-gate CLI exception-handling check passed");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
