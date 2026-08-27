import fs from "node:fs";
import path from "node:path";
import { expectedSummary, readAxeEvidence, readLighthouseReports } from "./quality-verification.mjs";

function argument(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) throw new Error(`Missing ${name}`);
  return process.argv[index + 1];
}

const lighthouseDir = path.resolve(argument("--lighthouse-dir"));
const axePath = path.resolve(argument("--axe"));
const contractPath = path.resolve(argument("--contract"));
const sourceSha = argument("--sha");
const outputPath = path.resolve(argument("--output"));

const failures = [];
if (!/^[a-f0-9]{40}$/.test(sourceSha)) failures.push("--sha must be a full 40-character Git SHA");

let contract = null;
try {
  contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
} catch {
  failures.push("--contract is missing or invalid JSON");
}

const lighthouse = contract
  ? readLighthouseReports(lighthouseDir, contract)
  : { failures: ["contract unavailable, could not validate Lighthouse reports"], runs: [] };
failures.push(...lighthouse.failures);

const lighthouseMajor = lighthouse.runs[0]?.environment?.browserMajor;
const axe = contract
  ? readAxeEvidence(axePath, sourceSha, contract, lighthouseMajor)
  : { failures: ["contract unavailable, could not validate axe evidence"], axe: null };
failures.push(...axe.failures);

// Every route, browser environment, metric, and digest check above must be
// clean before the worst-case decision can be trusted. Any structural
// problem fails closed instead of silently falling back to a best-effort
// summary.
let summary;
if (contract && failures.length === 0 && lighthouse.runs.length === contract.lighthouseRuns && axe.axe) {
  summary = expectedSummary({ sourceSha, contract, runs: lighthouse.runs, axe: axe.axe });
} else {
  summary = {
    schemaVersion: 1,
    sourceSha,
    route: contract?.route ?? null,
    aggregation: contract?.aggregation ?? null,
    thresholds: contract?.thresholds ?? null,
    lighthouseRuns: lighthouse.runs,
    axe: axe.axe,
    worstCase: null,
    failures: [...new Set(failures)],
    releaseDecision: "failed",
  };
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);

process.exitCode = summary.releaseDecision === "passed" ? 0 : 1;
