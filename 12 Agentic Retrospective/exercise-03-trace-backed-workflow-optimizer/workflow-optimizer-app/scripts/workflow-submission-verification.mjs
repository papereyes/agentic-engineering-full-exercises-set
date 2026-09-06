import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { computeBenchmark, responseSha256 } from "./workflow-grading.mjs";
import { verifyEvidenceOnlyHistory } from "../../../../scripts/comparable-evidence.mjs";

const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const ACTION_TYPES = new Set(["scope", "clarify", "source-decision", "edit", "verify"]);
const ACTION_TARGETS = new Set(["queue-filter", "billing-export", "current-policy", "legacy-note", "release-gate", "deletion-mode", "decision-contract", "client", "api", "protected-policy"]);
const RESPONSE_FIELDS = new Set(["actions", "findings", "contextSelections", "blocker", "completion"]);

function git(root, args, { trim = true } = {}) {
  const output = execFileSync("git", args, { cwd: root, encoding: "utf8" });
  return trim ? output.trim() : output;
}

export function normalizeCommittedText(source) {
  return source.replaceAll("\r\n", "\n").replace(/\n$/, "");
}

export function createSnapshotPatch(file, source) {
  const content = `${normalizeCommittedText(source)}\n`;
  const lines = content.slice(0, -1).split("\n");
  const header = Buffer.from(`blob ${Buffer.byteLength(content)}\0`);
  const blob = crypto.createHash("sha1").update(header).update(content).digest("hex");
  return [
    `diff --git a/${file} b/${file}`,
    "new file mode 100644",
    `index ${"0".repeat(40)}..${blob}`,
    "--- /dev/null",
    `+++ b/${file}`,
    `@@ -0,0 +1,${lines.length} @@`,
    ...lines.map((line) => `+${line}`),
    "",
  ].join("\n");
}

export function verifyWorkflowPatches({ repositoryRoot, exerciseRoot, baselineSha, candidateSha }) {
  const failures = [];
  const prefix = path.relative(repositoryRoot, exerciseRoot).split(path.sep).join("/");
  const workflowFile = `${prefix}/workflow-optimizer-app/workflow/instructions.md`;
  try {
    const baselineSource = git(repositoryRoot, ["show", `${baselineSha}:${workflowFile}`], { trim: false });
    const expectedBefore = createSnapshotPatch(workflowFile, baselineSource);
    const actualBefore = fs.readFileSync(path.join(exerciseRoot, "evidence/before.patch"), "utf8").replaceAll("\r\n", "\n");
    if (actualBefore !== expectedBefore) failures.push("before.patch must be the generated snapshot patch for baselineSha");
    const expectedAfter = execFileSync("git", ["diff", "--binary", "--full-index", baselineSha, candidateSha, "--", workflowFile], { cwd: repositoryRoot });
    const actualAfter = fs.readFileSync(path.join(exerciseRoot, "evidence/after.patch"));
    if (!actualAfter.equals(expectedAfter)) failures.push("after.patch must exactly match the baselineSha-to-candidateSha workflow diff");
  } catch {
    failures.push("unable to bind workflow patches to baselineSha and candidateSha");
  }
  return failures;
}

export function validateInstructions(instructions, cases) {
  const failures = [];
  const lines = instructions.split(/\r?\n/).length;
  const words = instructions.trim().split(/\s+/).filter(Boolean).length;
  if (lines > 120) failures.push("candidate workflow exceeds 120 lines");
  if (words > 1800) failures.push("candidate workflow exceeds 1,800 words");
  const forbidden = cases.flatMap((item) => [item.id, ...item.assertions.map((assertion) => assertion.id), ...(item.leakagePhrases ?? [])]);
  for (const phrase of forbidden) if (instructions.toLowerCase().includes(phrase.toLowerCase())) failures.push(`candidate workflow leaks protected identifier ${phrase}`);
  for (const term of ["scope", "clarify", "authoritative", "contradiction", "context", "failed", "stop", "verification", "exit code", "completion"] ) if (!instructions.toLowerCase().includes(term)) failures.push(`candidate workflow is missing general behavior ${term}`);
  return failures;
}

export function validateRuns(cases, baseline, candidate, expectedWorkflowHashes = {}) {
  const failures = [];
  const all = [...baseline, ...candidate];
  const expectedCount = cases.length * 3;
  if (baseline.length !== expectedCount) failures.push(`baseline-runs.json must contain exactly ${expectedCount} runs`);
  if (candidate.length !== expectedCount) failures.push(`candidate-runs.json must contain exactly ${expectedCount} runs`);
  const caseIds = new Set(cases.map((item) => item.id));
  for (const [lane, runsForLane] of [["baseline", baseline], ["candidate", candidate]]) {
    for (const run of runsForLane) {
      if (run.lane !== lane) failures.push(`${run.caseId}/${run.run} is stored in ${lane}-runs.json with lane ${String(run.lane)}`);
      if (!caseIds.has(run.caseId)) failures.push(`${lane}-runs.json contains unknown case ${String(run.caseId)}`);
    }
  }
  for (const item of cases) for (const [lane, runsForLane] of [["baseline", baseline], ["candidate", candidate]]) {
    const runs = runsForLane.filter((run) => run.caseId === item.id && run.lane === lane);
    if (runs.length !== 3 || JSON.stringify(runs.map((run) => run.run).sort()) !== JSON.stringify([1, 2, 3])) failures.push(`${item.id}/${lane} needs runs 1, 2, and 3 exactly once`);
  }
  const conditionFields = ["agent", "model", "settingsHash", "toolsHash", "permissionsHash", "timeLimitMinutes"];
  const sessionIds = new Set();
  for (const item of cases) for (const runNumber of [1, 2, 3]) {
    const before = baseline.find((run) => run.caseId === item.id && run.run === runNumber);
    const after = candidate.find((run) => run.caseId === item.id && run.run === runNumber);
    for (const field of conditionFields) if (before?.[field] !== after?.[field]) failures.push(`${item.id}/${runNumber} changed ${field}`);
  }
  for (const run of all) {
    for (const field of conditionFields.filter((field) => field !== "timeLimitMinutes")) if (typeof run[field] !== "string" || run[field].trim().length < 3) failures.push(`${run.caseId}/${run.lane}/${run.run} needs non-empty ${field}`);
    if (!Number.isInteger(run.timeLimitMinutes) || run.timeLimitMinutes <= 0) failures.push(`${run.caseId}/${run.lane}/${run.run} needs a positive integer timeLimitMinutes`);
    if (!Number.isInteger(run.tokens) || run.tokens <= 0 || !Number.isInteger(run.durationMs) || run.durationMs <= 0) failures.push(`${run.caseId}/${run.lane}/${run.run} needs positive integer cost metrics`);
    if (typeof run.sessionId !== "string" || run.sessionId.trim().length < 3) failures.push(`${run.caseId}/${run.lane}/${run.run} needs a sessionId from the raw agent run`);
    else if (sessionIds.has(run.sessionId)) failures.push(`${run.caseId}/${run.lane}/${run.run} reuses sessionId ${run.sessionId}`);
    else sessionIds.add(run.sessionId);
    if (typeof run.metricsSource !== "string" || !run.metricsSource.includes(run.sessionId)) failures.push(`${run.caseId}/${run.lane}/${run.run} metricsSource must identify its raw sessionId`);
    const capturedAt = run.capturedAt ?? "";
    if (!ISO_INSTANT.test(capturedAt) || !Number.isFinite(Date.parse(capturedAt))) failures.push(`${run.caseId}/${run.lane}/${run.run} needs an ISO capturedAt timestamp`);
    if (!/^[a-f0-9]{64}$/.test(run.workflowSha256 ?? "")) failures.push(`${run.caseId}/${run.lane}/${run.run} needs workflowSha256`);
    else if (expectedWorkflowHashes[run.lane] && run.workflowSha256 !== expectedWorkflowHashes[run.lane]) failures.push(`${run.caseId}/${run.lane}/${run.run} workflowSha256 does not match its repository commit`);
    if (run.responseSha256 !== responseSha256(run.response)) failures.push(`${run.caseId}/${run.lane}/${run.run} response hash mismatch`);
    const responseLabel = `${run.caseId}/${run.lane}/${run.run}`;
    if (!run.response || typeof run.response !== "object" || Array.isArray(run.response)) {
      failures.push(`${responseLabel} response must be an object`);
      continue;
    }
    for (const field of Object.keys(run.response)) if (!RESPONSE_FIELDS.has(field)) failures.push(`${responseLabel} response contains unsupported field ${field}`);
    if (!Array.isArray(run.response.actions) || run.response.actions.length === 0) failures.push(`${responseLabel} needs at least one action`);
    else {
      let previousSequence = 0;
      for (const action of run.response.actions) {
        if (!action || typeof action !== "object" || Array.isArray(action)) { failures.push(`${responseLabel} contains an invalid action`); continue; }
        if (!Number.isInteger(action.sequence) || action.sequence <= previousSequence) failures.push(`${responseLabel} action sequences must be increasing positive integers`);
        previousSequence = action.sequence;
        if (!ACTION_TYPES.has(action.type)) failures.push(`${responseLabel} action has unsupported type ${String(action.type)}`);
        if (!ACTION_TARGETS.has(action.target)) failures.push(`${responseLabel} action has unsupported target ${String(action.target)}`);
        if (typeof action.result !== "string" || action.result.trim() === "") failures.push(`${responseLabel} action needs a result`);
        if (action.type === "verify" && !Number.isInteger(action.exitCode)) failures.push(`${responseLabel} verification action needs an integer exitCode`);
      }
    }
    if (run.response.findings !== undefined && (!Array.isArray(run.response.findings) || run.response.findings.some((finding) => !finding || typeof finding.type !== "string" || !Array.isArray(finding.sources) || finding.sources.some((source) => typeof source !== "string")))) failures.push(`${responseLabel} findings must contain a type and string sources`);
    if (run.response.contextSelections !== undefined && (!Array.isArray(run.response.contextSelections) || run.response.contextSelections.some((source) => typeof source !== "string"))) failures.push(`${responseLabel} contextSelections must be a string array`);
    if (run.response.blocker !== undefined && (!run.response.blocker || typeof run.response.blocker.reported !== "boolean" || typeof run.response.blocker.target !== "string")) failures.push(`${responseLabel} blocker must contain reported and target`);
    if (run.response.completion !== undefined && (!run.response.completion || typeof run.response.completion.claimed !== "boolean" || !Array.isArray(run.response.completion.evidenceSequences) || run.response.completion.evidenceSequences.some((sequence) => !Number.isInteger(sequence)))) failures.push(`${responseLabel} completion must contain claimed and integer evidenceSequences`);
  }
  return failures;
}

export function verifyWorkflowHistory({ repositoryRoot, exerciseRoot, baselineSha, candidateSha }) {
  const failures = [];
  try {
    if (git(repositoryRoot, ["rev-parse", `${candidateSha}^`]) !== baselineSha) failures.push("candidateSha must directly follow baselineSha");
    git(repositoryRoot, ["merge-base", "--is-ancestor", candidateSha, "HEAD"]);
    const prefix = path.relative(repositoryRoot, exerciseRoot).split(path.sep).join("/");
    const workflowFile = `${prefix}/workflow-optimizer-app/workflow/instructions.md`;
    const actual = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", candidateSha]).split(/\r?\n/).filter(Boolean);
    if (actual.length !== 1 || actual[0] !== workflowFile) failures.push("candidateSha must change only workflow/instructions.md");
    const baselineWorkflow = normalizeCommittedText(git(repositoryRoot, ["show", `${baselineSha}:${workflowFile}`], { trim: false }));
    const fixture = normalizeCommittedText(fs.readFileSync(path.join(exerciseRoot, "workflow-optimizer-app/fixtures/workflow-baseline.md"), "utf8"));
    if (baselineWorkflow !== fixture) failures.push("baselineSha does not contain the protected baseline workflow");
    failures.push(...verifyEvidenceOnlyHistory({ repositoryRoot, exerciseRoot, fromCommit: candidateSha }));
  } catch { failures.push("baselineSha and candidateSha must be ordered full ancestor commits"); }
  return failures;
}

export function compareBenchmarks(expected, actual) {
  return JSON.stringify(expected) === JSON.stringify(actual) ? [] : ["benchmark.json does not exactly match deterministic grading of raw runs"];
}
