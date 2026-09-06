import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { analyzeSession } from "../src/retro/analyzeSession.mjs";
import { validateReplay, validateReplayOrder, validateReplayProvenance, verifyRetroHistory } from "./retro-verification.mjs";

const appRoot = process.cwd();
const exerciseRoot = path.resolve(appRoot, "..");
const repositoryRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: appRoot, encoding: "utf8" }).trim();
const evidenceRoot = path.join(exerciseRoot, "evidence");
const failures = [];
function json(file, label) { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { failures.push(`missing or invalid ${label}`); return null; } }
function evidenceField(file, name) {
  if (!fs.existsSync(file)) return "";
  const match = fs.readFileSync(file, "utf8").match(new RegExp(`^\\s*(?:[-*]\\s*)?${name}:\\s*(.+?)\\s*$`, "mi"));
  return match?.[1]?.replace(/^`|`$/g, "").trim() ?? "";
}
const baselineEvents = json(path.join(exerciseRoot, "docs/session-events.json"), "baseline events") ?? [];
const baselineMetadata = json(path.join(exerciseRoot, "docs/session-metadata.json"), "baseline metadata") ?? {};
const replayEvents = json(path.join(evidenceRoot, "replay-events.json"), "replay events") ?? [];
const replayMetadata = json(path.join(evidenceRoot, "replay-metadata.json"), "replay metadata") ?? {};
const submittedBaseline = json(path.join(evidenceRoot, "baseline.json"), "baseline metrics");
const submittedAfter = json(path.join(evidenceRoot, "after.json"), "after metrics");
let baseline;
let replay;
try { baseline = analyzeSession(baselineEvents); } catch (error) { failures.push(`baseline analysis failed: ${error.message}`); }
try { replay = analyzeSession(replayEvents); } catch (error) { failures.push(`replay analysis failed: ${error.message}`); }
if (baseline && JSON.stringify(submittedBaseline) !== JSON.stringify(baseline)) failures.push("baseline.json is not analyzer output for the protected trace");
if (replay && JSON.stringify(submittedAfter) !== JSON.stringify(replay)) failures.push("after.json is not analyzer output for replay-events.json");
if (baseline && replay) failures.push(...validateReplay({ baseline, replay, baselineMetadata, replayMetadata }));
failures.push(...validateReplayProvenance({ baselineEvents, replayEvents, replayMetadata }));
failures.push(...validateReplayOrder(replayEvents));
const promptPath = path.join(exerciseRoot, baselineMetadata.promptPath ?? "");
if (!fs.existsSync(promptPath)) failures.push("session metadata promptPath is missing");
else {
  const promptHash = `sha256:${crypto.createHash("sha256").update(fs.readFileSync(promptPath, "utf8").replaceAll("\r\n", "\n")).digest("hex")}`;
  if (promptHash !== baselineMetadata.promptHash) failures.push("session metadata promptHash does not match the supplied replay brief");
}
for (const type of ["read", "command", "diagnosis", "write"]) if (!replayEvents.some((event) => event.type === type)) failures.push(`replay events are missing ${type}`);
if (!replayEvents.some((event) => event.type === "command" && event.result === "failed") || !replayEvents.some((event) => event.type === "command" && event.result === "passed" && event.phase === "focused-test")) failures.push("replay must contain failed, diagnosed, and later passed focused testing");
const history = json(path.join(evidenceRoot, "history.json"), "history evidence") ?? {};
if (!/^[a-f0-9]{40}$/.test(history.sourceSha ?? "")) failures.push("sourceSha must be a full commit SHA");
const beforeFile = path.join(evidenceRoot, "before.md");
const afterFile = path.join(evidenceRoot, "after.md");
const startingCommit = evidenceField(afterFile, "Starting commit");
if (evidenceField(beforeFile, "Starting commit") !== startingCommit) failures.push("before.md and after.md must record the same Starting commit");
if (evidenceField(afterFile, "Implementation commit") !== history.sourceSha) failures.push("after.md Implementation commit must equal sourceSha");
if (history.sourceSha && startingCommit) failures.push(...verifyRetroHistory({ repositoryRoot, exerciseRoot, startingCommit, sourceSha: history.sourceSha }));
for (const [file, terms] of [
  ["retrospective.md", ["definition", "unchanged failure", "root cause", "preflight", "correctness", "remaining waste"]],
  ["replay.md", ["POLICY-217", "constructed replay", "same agent", "same model", "same prompt", "new session", "before", "after", "final verification"]],
]) {
  const content = fs.existsSync(path.join(evidenceRoot, file)) ? fs.readFileSync(path.join(evidenceRoot, file), "utf8") : "";
  for (const term of terms) if (!content.toLowerCase().includes(term.toLowerCase())) failures.push(`${file} is missing ${term}`);
}
if (failures.length) {
  console.error(`Retrospective verification failed:\n${[...new Set(failures)].map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}
console.log(`Source SHA: ${history.sourceSha}`);
console.log(`PASS preventable calls ${baseline.preventableCalls} -> ${replay.preventableCalls}`);
console.log("PASS unchanged retries eliminated and final correctness verified");
