import path from "node:path";
import { execFileSync } from "node:child_process";
import { verifyEvidenceOnlyHistory } from "../../../../scripts/comparable-evidence.mjs";

function git(root, args) { return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim(); }
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export function validateReplay({ baseline, replay, baselineMetadata, replayMetadata }) {
  const failures = [];
  for (const field of ["taskId", "agent", "model", "captureMode", "promptHash", "timeLimitMinutes"]) {
    if (replayMetadata?.[field] !== baselineMetadata?.[field]) failures.push(`replay metadata changed ${field}`);
  }
  if (!replayMetadata?.sessionId || replayMetadata.sessionId === baselineMetadata?.sessionId) failures.push("replay must use a different non-empty sessionId");
  if (replay.unchangedFailureRetries !== 0) failures.push("replay must eliminate unchanged failed-command retries");
  if (replay.preventableCalls > baseline.preventableCalls - 2) failures.push("replay must reduce preventable calls by at least two");
  if (!replay.correctnessPassed || replay.finalVerificationRuns < 1) failures.push("replay needs passed final verification after the last write");
  return failures;
}

function comparablePayload(event) {
  const fields = ["type", "target", "contentVersion", "workspaceRevision", "result", "bytes", "phase"];
  return JSON.stringify(Object.fromEntries(fields.filter((field) => event[field] !== undefined).map((field) => [field, event[field]])));
}

export function validateReplayProvenance({ baselineEvents, replayEvents, replayMetadata }) {
  const failures = [];
  const eventIds = new Set();
  let previousTimestamp = -Infinity;
  for (const [index, event] of replayEvents.entries()) {
    if (typeof event.eventId !== "string" || event.eventId.trim().length < 3) failures.push(`replay event ${index + 1} needs a unique eventId`);
    else if (eventIds.has(event.eventId)) failures.push(`replay eventId ${event.eventId} is duplicated`);
    else eventIds.add(event.eventId);
    if (event.sessionId !== replayMetadata?.sessionId) failures.push(`replay event ${index + 1} is not bound to replay sessionId`);
    const capturedAt = event.capturedAt ?? "";
    const timestamp = Date.parse(capturedAt);
    if (!ISO_INSTANT.test(capturedAt) || !Number.isFinite(timestamp)) failures.push(`replay event ${index + 1} needs an ISO capturedAt timestamp`);
    else if (timestamp < previousTimestamp) failures.push("replay capturedAt timestamps must be ordered");
    else previousTimestamp = timestamp;
  }

  const baseline = baselineEvents.map(comparablePayload);
  const replay = replayEvents.map(comparablePayload);
  let longestCopiedSequence = 0;
  for (let baselineIndex = 0; baselineIndex < baseline.length; baselineIndex += 1) {
    for (let replayIndex = 0; replayIndex < replay.length; replayIndex += 1) {
      let length = 0;
      while (baseline[baselineIndex + length] && baseline[baselineIndex + length] === replay[replayIndex + length]) length += 1;
      longestCopiedSequence = Math.max(longestCopiedSequence, length);
    }
  }
  if (longestCopiedSequence >= 3) failures.push(`replay copies ${longestCopiedSequence} consecutive protected baseline payloads`);
  return failures;
}

export function validateReplayOrder(replayEvents) {
  const failedIndex = replayEvents.findIndex((event) => event.type === "command" && event.phase === "focused-test" && event.result === "failed");
  const diagnosisIndex = replayEvents.findIndex((event, index) => index > failedIndex && event.type === "diagnosis");
  const passedIndex = replayEvents.findIndex((event, index) => index > diagnosisIndex && event.type === "command" && event.phase === "focused-test" && event.result === "passed");
  return failedIndex >= 0 && diagnosisIndex > failedIndex && passedIndex > diagnosisIndex
    ? []
    : ["replay must record failed focused test, later diagnosis, then later passed focused test in that order"];
}

export function verifyRetroHistory({ repositoryRoot, exerciseRoot, startingCommit, sourceSha }) {
  const failures = [];
  try {
    if (git(repositoryRoot, ["rev-parse", `${sourceSha}^`]) !== startingCommit) failures.push("sourceSha must directly follow the recorded Starting commit");
    git(repositoryRoot, ["merge-base", "--is-ancestor", sourceSha, "HEAD"]);
    const prefix = path.relative(repositoryRoot, exerciseRoot).split(path.sep).join("/");
    const expected = [
      `${prefix}/session-waste-app/src/retro/analyzeSession.mjs`,
      `${prefix}/session-waste-app/src/retro/analyzeSession.test.mjs`,
      `${prefix}/session-waste-app/src/retro/preflightPolicy.mjs`,
    ].sort();
    const actual = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", sourceSha]).split(/\r?\n/).filter(Boolean).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) failures.push("sourceSha must contain only analyzer, preflight, and participant test");
    failures.push(...verifyEvidenceOnlyHistory({ repositoryRoot, exerciseRoot, fromCommit: sourceSha }));
  } catch { failures.push("sourceSha must be a full ancestor commit"); }
  return failures;
}
