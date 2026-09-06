import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const exerciseRoot = path.resolve(process.cwd(), "..");
const apiRoot = path.join(exerciseRoot, "legacy-rules-api");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-rules-verification-"));
const verificationApiRoot = path.join(temporaryRoot, "legacy-rules-api");
try {
  fs.cpSync(apiRoot, verificationApiRoot, {
    recursive: true,
    filter: (source) => !source.split(path.sep).includes("target"),
  });
  if (process.platform === "win32") {
    execFileSync("cmd.exe", ["/d", "/s", "/c", "mvnw.cmd", "test", "--no-transfer-progress"], { cwd: verificationApiRoot, stdio: "inherit" });
  } else {
    execFileSync("./mvnw", ["test", "--no-transfer-progress"], { cwd: verificationApiRoot, stdio: "inherit" });
  }
  const participantReport = path.join(verificationApiRoot, "target", "surefire-reports", "TEST-dev.agentic.exercise.workflow.WorkflowPolicyCharacterizationTest.xml");
  if (!fs.existsSync(participantReport)) throw new Error("WorkflowPolicyCharacterizationTest must contain discovered JUnit tests");
  const report = fs.readFileSync(participantReport, "utf8");
  const tests = Number(report.match(/\btests="(\d+)"/)?.[1] ?? 0);
  const failures = Number(report.match(/\bfailures="(\d+)"/)?.[1] ?? 0);
  const errors = Number(report.match(/\berrors="(\d+)"/)?.[1] ?? 0);
  if (tests < 1 || failures !== 0 || errors !== 0) throw new Error("WorkflowPolicyCharacterizationTest must execute at least one passing JUnit test");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

const service = fs.readFileSync(path.join(apiRoot, "src/main/java/dev/agentic/exercise/workflow/WorkflowService.java"), "utf8");
const policyPath = path.join(apiRoot, "src/main/java/dev/agentic/exercise/workflow/DecisionPolicy.java");
if (!fs.existsSync(policyPath)) throw new Error("Create DecisionPolicy.java");
const policy = fs.readFileSync(policyPath, "utf8");
if (/\bReady\b|Ready decisions require a longer evidence note/.test(service)) throw new Error("Decision validation remains in WorkflowService");
if (!policy.includes('"Ready".equals') || !policy.includes("Ready decisions require a longer evidence note")) throw new Error("DecisionPolicy does not own the protected Ready rule");
if (/WorkflowRepository|\.save\(|\.findById\(/.test(policy)) throw new Error("DecisionPolicy must not access persistence");
if (!/\bvoid\s+validate\s*\(\s*WorkflowDecision\s+\w+\s*\)/.test(policy)) throw new Error("DecisionPolicy.validate must validate without returning a replacement item");
if (!/\bdecisionPolicy\s*\.\s*validate\s*\(\s*decision\s*\)/.test(service)) throw new Error("WorkflowService must delegate validation to the injected DecisionPolicy");
execFileSync(process.execPath, ["./scripts/run-client-contract.mjs"], { cwd: process.cwd(), stdio: "inherit" });
console.log("PASS backend architecture, behavior, HTTP JSON, and client contract");
