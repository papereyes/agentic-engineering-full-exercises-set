import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { computeBenchmark } from "./workflow-grading.mjs";
import { compareBenchmarks, normalizeCommittedText, validateInstructions, validateRuns, verifyWorkflowHistory, verifyWorkflowPatches } from "./workflow-submission-verification.mjs";

const appRoot = process.cwd();
const exerciseRoot = path.resolve(appRoot, "..");
const evidenceRoot = path.join(exerciseRoot, "evidence");
const repositoryRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: appRoot, encoding: "utf8" }).trim();
const failures = [];
function json(file, label) { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { failures.push(`missing or invalid ${label}`); return null; } }
function evidenceField(file, name) {
  if (!fs.existsSync(file)) return "";
  const match = fs.readFileSync(file, "utf8").match(new RegExp(`^\\s*(?:[-*]\\s*)?${name}:\\s*(.+?)\\s*$`, "mi"));
  return match?.[1]?.replace(/^`|`$/g, "").trim() ?? "";
}
const cases = json(path.join(appRoot, "evals/replay-cases.json"), "replay cases") ?? [];
const baseline = json(path.join(evidenceRoot, "baseline-runs.json"), "baseline runs") ?? [];
const candidate = json(path.join(evidenceRoot, "candidate-runs.json"), "candidate runs") ?? [];
const submittedBenchmark = json(path.join(evidenceRoot, "benchmark.json"), "benchmark") ?? {};
const history = json(path.join(evidenceRoot, "history.json"), "history evidence") ?? {};
const instructions = fs.readFileSync(path.join(appRoot, "workflow/instructions.md"), "utf8");
failures.push(...validateInstructions(instructions, cases));
let expectedWorkflowHashes = {};
if (/^[a-f0-9]{40}$/.test(history.baselineSha ?? "") && /^[a-f0-9]{40}$/.test(history.candidateSha ?? "")) {
  const prefix = path.relative(repositoryRoot, exerciseRoot).split(path.sep).join("/");
  const workflowFile = `${prefix}/workflow-optimizer-app/workflow/instructions.md`;
  try {
    const committedWorkflowHash = (commit) => crypto.createHash("sha256")
      .update(`${normalizeCommittedText(execFileSync("git", ["show", `${commit}:${workflowFile}`], { cwd: repositoryRoot, encoding: "utf8" }))}\n`)
      .digest("hex");
    expectedWorkflowHashes = { baseline: committedWorkflowHash(history.baselineSha), candidate: committedWorkflowHash(history.candidateSha) };
  } catch {
    failures.push("unable to calculate workflow hashes from baselineSha and candidateSha");
  }
}
failures.push(...validateRuns(cases, baseline, candidate, expectedWorkflowHashes));
const expectedBenchmark = computeBenchmark(cases, baseline, candidate);
failures.push(...compareBenchmarks(expectedBenchmark, submittedBenchmark));
if (!expectedBenchmark.adopt) failures.push("candidate does not satisfy every protected adoption threshold");
for (const field of ["baselineSha", "candidateSha"]) if (!/^[a-f0-9]{40}$/.test(history[field] ?? "")) failures.push(`${field} must be a full commit SHA`);
const beforeFile = path.join(evidenceRoot, "before.md");
const afterFile = path.join(evidenceRoot, "after.md");
if (evidenceField(beforeFile, "Starting commit") !== history.baselineSha || evidenceField(afterFile, "Starting commit") !== history.baselineSha) failures.push("before.md and after.md Starting commit must equal baselineSha");
if (evidenceField(beforeFile, "Implementation commit") !== history.baselineSha) failures.push("before.md Implementation commit must equal baselineSha");
if (evidenceField(afterFile, "Implementation commit") !== history.candidateSha) failures.push("after.md Implementation commit must equal candidateSha");
for (const run of baseline) if (run.repositorySha !== history.baselineSha) failures.push("every baseline run must bind to baselineSha");
for (const run of candidate) if (run.repositorySha !== history.candidateSha) failures.push("every candidate run must bind to candidateSha");
if (history.baselineSha && history.candidateSha) {
  failures.push(...verifyWorkflowHistory({ repositoryRoot, exerciseRoot, ...history }));
  failures.push(...verifyWorkflowPatches({ repositoryRoot, exerciseRoot, ...history }));
}
for (const [file, terms] of [
  ["failure-clusters.md", ["TR-01", "TR-12", "scope-before-action", "evidence-authority", "completion-verification", "context-selection", "clarification-boundary", "frequency", "workflow change"]],
  ["adoption.md", ["held-out", "train", "variance", "median tokens", "duration", "critical", "limitation", "adopt"]],
]) {
  const content = fs.existsSync(path.join(evidenceRoot, file)) ? fs.readFileSync(path.join(evidenceRoot, file), "utf8") : "";
  for (const term of terms) if (!content.toLowerCase().includes(term.toLowerCase())) failures.push(`${file} is missing ${term}`);
}
if (failures.length) {
  console.error(`Workflow verification failed:\n${[...new Set(failures)].map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}
console.log(`Baseline SHA: ${history.baselineSha}`);
console.log(`Candidate SHA: ${history.candidateSha}`);
console.log(`PASS train ${expectedBenchmark.summary.baseline.trainQuality.toFixed(3)} -> ${expectedBenchmark.summary.candidate.trainQuality.toFixed(3)}`);
console.log(`PASS held-out ${expectedBenchmark.summary.baseline.heldoutQuality.toFixed(3)} -> ${expectedBenchmark.summary.candidate.heldoutQuality.toFixed(3)}`);
console.log("PASS all critical, variance, token, duration, integrity, and history gates");
