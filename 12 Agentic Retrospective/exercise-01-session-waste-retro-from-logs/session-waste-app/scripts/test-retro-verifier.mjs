import assert from "node:assert/strict";
import { validateReplay, validateReplayOrder, validateReplayProvenance } from "./retro-verification.mjs";

const metadata = { taskId: "T", agent: "A", model: "M", captureMode: "constructed-replay", promptHash: "H", timeLimitMinutes: 20, sessionId: "before" };
const baseline = { preventableCalls: 4 };
const replay = { preventableCalls: 2, unchangedFailureRetries: 0, correctnessPassed: true, finalVerificationRuns: 1 };
assert.deepEqual(validateReplay({ baseline, replay, baselineMetadata: metadata, replayMetadata: { ...metadata, sessionId: "after" } }), []);
assert.ok(validateReplay({ baseline, replay: { ...replay, unchangedFailureRetries: 1 }, baselineMetadata: metadata, replayMetadata: { ...metadata, sessionId: "after" } }).length > 0);
const baselineEvents = [
  { sequence: 1, type: "read", target: "one", result: "ok" },
  { sequence: 2, type: "read", target: "two", result: "ok" },
  { sequence: 3, type: "command", target: "test", result: "failed" },
];
const replayMetadata = { ...metadata, sessionId: "after" };
const freshEvents = baselineEvents.map((event, index) => ({ ...event, target: `${event.target}-fresh`, eventId: `event-${index}`, sessionId: "after", capturedAt: `2026-08-12T09:0${index}:00.000Z` }));
assert.deepEqual(validateReplayProvenance({ baselineEvents, replayEvents: freshEvents, replayMetadata }), []);
assert.deepEqual(validateReplayOrder([
  { type: "command", phase: "focused-test", result: "failed" },
  { type: "diagnosis", result: "ok" },
  { type: "command", phase: "focused-test", result: "passed" },
]), []);
assert.ok(validateReplayOrder([
  { type: "diagnosis", result: "ok" },
  { type: "command", phase: "focused-test", result: "failed" },
  { type: "command", phase: "focused-test", result: "passed" },
]).length > 0);
const nonIsoEvents = freshEvents.map((event) => ({ ...event }));
nonIsoEvents[0].capturedAt = "August 12, 2026 09:00:00 UTC";
assert.ok(validateReplayProvenance({ baselineEvents, replayEvents: nonIsoEvents, replayMetadata }).some((failure) => failure.includes("ISO capturedAt")));
const copiedEvents = baselineEvents.map((event, index) => ({ ...event, sequence: index + 10, eventId: `copy-${index}`, sessionId: "after", capturedAt: `2026-08-12T10:0${index}:00.000Z` }));
assert.ok(validateReplayProvenance({ baselineEvents, replayEvents: copiedEvents, replayMetadata }).some((failure) => failure.includes("consecutive protected baseline")));
const copiedWithNoise = copiedEvents.map((event, index) => ({ ...event, replayNote: `ignored-${index}` }));
assert.ok(validateReplayProvenance({ baselineEvents, replayEvents: copiedWithNoise, replayMetadata }).some((failure) => failure.includes("consecutive protected baseline")));
console.log("session retrospective verifier self-test passed");
