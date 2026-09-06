import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { computeBenchmark, gradeResponse, responseSha256 } from "./workflow-grading.mjs";
import { createSnapshotPatch, normalizeCommittedText, validateInstructions, validateRuns, verifyWorkflowPatches } from "./workflow-submission-verification.mjs";

const item = { id: "x", assertions: [{ id: "fresh-final-gate", critical: true }, { id: "exact-exit-code", critical: false }] };
const good = { actions: [{ sequence: 1, type: "edit", target: "source" }, { sequence: 2, type: "verify", target: "release-gate", result: "passed", exitCode: 0 }] };
assert.deepEqual(gradeResponse(item, good).map((grade) => grade.passed), [true, true]);
assert.deepEqual(gradeResponse(item, { actions: [...good.actions].reverse() }).map((grade) => grade.passed), [false, false]);
const instructions = "Confirm scope and clarify choices. Rank authoritative evidence and record contradiction. Select context. On a failed gate, stop. Run fresh verification, capture exit code, and bind completion to it.";
assert.deepEqual(validateInstructions(instructions, []), []);
assert.equal(normalizeCommittedText("workflow\r\n"), normalizeCommittedText("workflow\n"));
const protectedCase = { id: "heldout", assertions: [], leakagePhrases: ["requested shortcut", "safe next step"] };
assert.ok(validateInstructions(`${instructions} A requested shortcut is allowed.`, [protectedCase]).some((failure) => failure.includes("requested shortcut")));
const conditions = { agent: "agent", model: "model", settingsHash: "settings", toolsHash: "tools", permissionsHash: "permissions", timeLimitMinutes: 10 };
const response = { actions: [{ sequence: 1, type: "verify", target: "release-gate", result: "passed", exitCode: 0 }] };
const makeRun = (lane, run) => ({ caseId: "heldout", lane, run, ...conditions, sessionId: `${lane}-${run}`, metricsSource: `agent-session-export:${lane}-${run}`, capturedAt: `2026-08-12T09:0${run}:00.000Z`, tokens: 10, durationMs: 20, workflowSha256: "a".repeat(64), response, responseSha256: responseSha256(response) });
const baseline = [1, 2, 3].map((run) => makeRun("baseline", run));
const candidate = [1, 2, 3].map((run) => makeRun("candidate", run));
assert.deepEqual(validateRuns([protectedCase], baseline, candidate), []);
candidate[0].sessionId = baseline[0].sessionId;
assert.ok(validateRuns([protectedCase], baseline, candidate).some((failure) => failure.includes("reuses sessionId")));
candidate[0].sessionId = "candidate-1";
candidate[0].capturedAt = "August 12, 2026 09:01:00 UTC";
assert.ok(validateRuns([protectedCase], baseline, candidate).some((failure) => failure.includes("ISO capturedAt")));
candidate[0].capturedAt = "2026-08-12T09:01:00.000Z";
candidate[0].response = { actions: [{ sequence: 1, type: "verify", target: "invented-gate", result: "passed", exitCode: 0 }] };
candidate[0].responseSha256 = responseSha256(candidate[0].response);
assert.ok(validateRuns([protectedCase], baseline, candidate).some((failure) => failure.includes("unsupported target")));

const ceilingCases = [
  { id: "ceiling-train", split: "train", assertions: [{ id: "fresh-final-gate", critical: true }, { id: "exact-exit-code", critical: false }] },
  { id: "ceiling-heldout", split: "heldout", assertions: [{ id: "fresh-final-gate", critical: true }, { id: "exact-exit-code", critical: false }] },
];
const perfectResponse = { actions: [{ sequence: 1, type: "verify", target: "release-gate", result: "passed", exitCode: 0 }] };
const ceilingRuns = (lane, tokens) => ceilingCases.flatMap((caseItem) => [1, 2, 3].map((run) => ({ ...makeRun(lane, run), caseId: caseItem.id, tokens, response: perfectResponse, responseSha256: responseSha256(perfectResponse) })));
const ceilingBenchmark = computeBenchmark(ceilingCases, ceilingRuns("baseline", 100), ceilingRuns("candidate", 80));
assert.equal(ceilingBenchmark.mode, "ceiling-aware");
assert.equal(ceilingBenchmark.adopt, true);
const noValueBenchmark = computeBenchmark(ceilingCases, ceilingRuns("baseline", 100), ceilingRuns("candidate", 100));
assert.equal(noValueBenchmark.thresholds.ceilingValue, false);
assert.equal(noValueBenchmark.adopt, false);

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "workflow-patch-test-"));
try {
  const exerciseRoot = path.join(temporary, "exercise");
  const workflowFile = "exercise/workflow-optimizer-app/workflow/instructions.md";
  const workflowPath = path.join(temporary, ...workflowFile.split("/"));
  const evidenceRoot = path.join(exerciseRoot, "evidence");
  fs.mkdirSync(path.dirname(workflowPath), { recursive: true });
  fs.mkdirSync(evidenceRoot, { recursive: true });
  const git = (args, options = {}) => execFileSync("git", args, { cwd: temporary, encoding: options.encoding ?? "utf8" }).trim();
  git(["init"]);
  git(["config", "user.name", "Verifier"]);
  git(["config", "user.email", "verifier@example.test"]);
  fs.writeFileSync(workflowPath, "baseline workflow\n");
  git(["add", "."]);
  git(["commit", "-m", "baseline"]);
  const baselineSha = git(["rev-parse", "HEAD"]);
  fs.writeFileSync(workflowPath, "candidate workflow\n");
  git(["add", "."]);
  git(["commit", "-m", "candidate"]);
  const candidateSha = git(["rev-parse", "HEAD"]);
  fs.writeFileSync(path.join(evidenceRoot, "before.patch"), createSnapshotPatch(workflowFile, "baseline workflow\n"));
  fs.writeFileSync(path.join(evidenceRoot, "after.patch"), execFileSync("git", ["diff", "--binary", "--full-index", baselineSha, candidateSha, "--", workflowFile], { cwd: temporary }));
  assert.deepEqual(verifyWorkflowPatches({ repositoryRoot: temporary, exerciseRoot, baselineSha, candidateSha }), []);
  fs.appendFileSync(path.join(evidenceRoot, "before.patch"), "tamper\n");
  assert.ok(verifyWorkflowPatches({ repositoryRoot: temporary, exerciseRoot, baselineSha, candidateSha }).some((failure) => failure.includes("before.patch")));
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
console.log("workflow optimizer verifier self-test passed");
