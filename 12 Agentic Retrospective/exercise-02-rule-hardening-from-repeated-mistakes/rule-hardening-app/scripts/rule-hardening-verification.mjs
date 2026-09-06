import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { verifyEvidenceOnlyHistory } from "../../../../scripts/comparable-evidence.mjs";

function git(root, args) { return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim(); }
export function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }

export function validateGuidance(agents, persistence, corrections) {
  const failures = [];
  const lowerAgents = agents.toLowerCase();
  const lowerPersistence = persistence.toLowerCase();
  if (agents.length > 1200) failures.push("AGENTS.md exceeds 1,200 characters");
  for (const term of [".agent/persistence.md", "persistence", "npm run test:persistence"]) if (!lowerAgents.includes(term)) failures.push(`AGENTS.md is missing ${term}`);
  for (const detail of ["display label", "canonical lowercase", "caller-provided clock", "new date"]) if (lowerAgents.includes(detail)) failures.push(`AGENTS.md duplicates deep detail ${detail}`);
  for (const term of ["stable id", "display label", "trim", "lowercase", "caller-provided clock", "new date", "exception", "product contract", "ui", "export", "log", "npm run test:persistence"]) if (!lowerPersistence.includes(term)) failures.push(`persistence.md is missing ${term}`);
  const counts = new Map();
  for (const correction of corrections) counts.set(correction.rootCause, (counts.get(correction.rootCause) ?? 0) + 1);
  for (const root of ["identity-vs-presentation", "canonical-enum-storage", "ambient-time"]) if ((counts.get(root) ?? 0) < 2) failures.push(`${root} lacks two independent corrections`);
  return failures;
}

export function evaluateDefectGate(beforeDefects, afterDefects) {
  const failures = [];
  if (afterDefects.length !== 0) failures.push(`after first attempt defects: ${afterDefects.join(", ")}`);
  if (beforeDefects.length > 0 && afterDefects.length >= beforeDefects.length) failures.push("after first attempt must reduce the baseline defect count");
  return {
    mode: beforeDefects.length === 0 ? "ceiling-no-regression" : "defect-improvement",
    failures,
  };
}

export async function applyAndGradePatch({ patchPath, starterPath }) {
  const patchSource = fs.readFileSync(patchPath, "utf8");
  const oldPaths = [...patchSource.matchAll(/^--- a\/(.+)$/gm)].map((match) => match[1].trim());
  const newPaths = [...patchSource.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((match) => match[1].trim());
  if (oldPaths.length !== 1 || newPaths.length !== 1 || oldPaths[0] !== newPaths[0] || !oldPaths[0].endsWith("rule-hardening-app/src/services/filterPersistence.mjs")) throw new Error("patch must modify only filterPersistence.mjs");
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "rule-hardening-"));
  try {
    const target = path.join(temporary, ...oldPaths[0].split("/"));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(starterPath, target);
    execFileSync("git", ["apply", "--check", patchPath], { cwd: temporary, stdio: "pipe" });
    execFileSync("git", ["apply", patchPath], { cwd: temporary, stdio: "pipe" });
    const source = fs.readFileSync(target, "utf8").replaceAll("\r\n", "\n");
    const { buildSavedFilter } = await import(`${pathToFileURL(target).href}?v=${sha256(patchSource)}`);
    const defects = [];
    const now = "2026-08-12T09:00:00.000Z";
    let clockCalls = 0;
    const variants = [
      { owner: { id: "user-42", label: "Asha Nair" }, statusLabel: " Blocked " },
      { owner: { id: "acct-900", label: "Account 900" }, statusLabel: " READY " },
    ];
    for (const [index, input] of variants.entries()) {
      const original = structuredClone(input);
      let result;
      try { result = buildSavedFilter(input, () => { clockCalls += 1; return now; }); } catch { defects.push(`variant ${index + 1} builder throws`); }
      if (result?.ownerId !== input.owner.id) defects.push(`variant ${index + 1} stable owner ID not stored`);
      if (result?.status !== input.statusLabel.trim().toLowerCase()) defects.push(`variant ${index + 1} status not canonical lowercase`);
      if (result?.updatedAt !== now) defects.push(`variant ${index + 1} caller clock not used`);
      if (JSON.stringify(Object.keys(result ?? {}).sort()) !== JSON.stringify(["ownerId", "status", "updatedAt"])) defects.push(`variant ${index + 1} durable record shape changed`);
      if (JSON.stringify(input) !== JSON.stringify(original)) defects.push(`variant ${index + 1} input mutated`);
    }
    if (clockCalls !== variants.length) defects.push("clock not called exactly once per record");
    return { defects, source, patchSha256: sha256(patchSource) };
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

export function verifyRuleHistory({ repositoryRoot, exerciseRoot, baselineSha, rulesSha, agentImplementationSha, implementationSha }) {
  const failures = [];
  try {
    if (git(repositoryRoot, ["rev-parse", `${rulesSha}^`]) !== baselineSha) failures.push("rulesSha must directly follow baselineSha");
    if (git(repositoryRoot, ["rev-parse", `${agentImplementationSha}^`]) !== rulesSha) failures.push("agentImplementationSha must directly follow rulesSha");
    if (git(repositoryRoot, ["rev-parse", `${implementationSha}^`]) !== agentImplementationSha) failures.push("implementationSha must directly follow agentImplementationSha");
    git(repositoryRoot, ["merge-base", "--is-ancestor", implementationSha, "HEAD"]);
    const prefix = path.relative(repositoryRoot, exerciseRoot).split(path.sep).join("/");
    const rulesFiles = [`${prefix}/.agent/persistence.md`, `${prefix}/AGENTS.md`].sort();
    for (const file of rulesFiles) {
      try { git(repositoryRoot, ["cat-file", "-e", `${baselineSha}:${file}`]); failures.push(`${file} must not exist at baselineSha`); } catch { /* expected */ }
    }
    const actualRules = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", rulesSha]).split(/\r?\n/).filter(Boolean).sort();
    if (JSON.stringify(actualRules) !== JSON.stringify(rulesFiles)) failures.push("rulesSha must contain only AGENTS.md and persistence.md");
    const sourceFile = `${prefix}/rule-hardening-app/src/services/filterPersistence.mjs`;
    const actualAgentImplementation = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", agentImplementationSha]).split(/\r?\n/).filter(Boolean);
    if (actualAgentImplementation.length !== 1 || actualAgentImplementation[0] !== sourceFile) failures.push("agentImplementationSha must contain only the graded filterPersistence.mjs patch");
    const testFile = `${prefix}/rule-hardening-app/src/services/filterPersistence.test.mjs`;
    const actualImplementation = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", implementationSha]).split(/\r?\n/).filter(Boolean);
    if (actualImplementation.length !== 1 || actualImplementation[0] !== testFile) failures.push("implementationSha must add only the participant test after the graded source commit");
    const participantTest = execFileSync("git", ["show", `${implementationSha}:${testFile}`], { cwd: repositoryRoot, encoding: "utf8" });
    const executableTest = participantTest.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    for (const term of ["buildSavedFilter", "assert", "ownerId", "status", "updatedAt"]) {
      if (!executableTest.includes(term)) failures.push(`participant test must assert ${term}`);
    }
    failures.push(...verifyEvidenceOnlyHistory({ repositoryRoot, exerciseRoot, fromCommit: implementationSha }));
  } catch { failures.push("baseline, rules, and implementation SHAs must be ordered ancestor commits"); }
  return failures;
}
