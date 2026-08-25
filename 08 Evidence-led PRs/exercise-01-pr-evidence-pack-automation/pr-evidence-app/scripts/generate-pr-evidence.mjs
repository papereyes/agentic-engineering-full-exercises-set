#!/usr/bin/env node
// Generates a PR evidence pack from a protected check-results fixture.
// Contract: docs/evidence-contract.md, docs/evidence-fixtures.md
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function arg(name) {
  const argv = process.argv;
  const index = argv.indexOf(name);
  return index === -1 ? undefined : argv[index + 1];
}

function fail(message) {
  console.error(`generate-pr-evidence: ${message}`);
  process.exit(1);
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

const fixtureArg = arg("--fixture");
const shaArg = arg("--sha");
const outputArg = arg("--output");

if (!fixtureArg) fail("--fixture is required");
if (!outputArg) fail("--output is required");
if (!/^[a-f0-9]{40}$/.test(shaArg ?? "")) fail("--sha must be a 40-character lowercase hex commit SHA");

const fixturePath = path.resolve(fixtureArg);
const fixtureDir = path.dirname(fixturePath);
const outputRoot = path.resolve(outputArg);

let fixtureBytes;
try {
  fixtureBytes = fs.readFileSync(fixturePath);
} catch {
  fail(`unable to read fixture at ${fixturePath}`);
}

let fixture;
try {
  fixture = JSON.parse(fixtureBytes.toString("utf8"));
} catch {
  fail("fixture is not valid JSON");
}

if (fixture?.schemaVersion !== 1 || !Array.isArray(fixture?.checks) || fixture.checks.length === 0) {
  fail("fixture must use schemaVersion 1 and contain a non-empty checks array");
}

// Phase 1: validate every check and resolve its artifact WITHOUT writing anything.
// Reject the whole fixture (write nothing) on the first problem found.
const requiredStringFields = ["name", "command", "result", "outputPath", "risk", "reviewerAction", "rollback"];
const seenFilenames = new Set();
const resolvedChecks = [];

for (const [index, check] of fixture.checks.entries()) {
  const label = `check ${index + 1}`;

  for (const field of requiredStringFields) {
    if (typeof check?.[field] !== "string" || !check[field].trim()) fail(`${label} is missing required field "${field}"`);
  }
  if (!Number.isInteger(check.exitCode) || check.exitCode < 0) fail(`${label} has an invalid exitCode`);
  if (!["passed", "failed"].includes(check.result)) fail(`${label} has an invalid result`);
  if ((check.result === "passed") !== (check.exitCode === 0)) fail(`${label} result and exitCode disagree`);

  const outputPath = check.outputPath;
  if (path.isAbsolute(outputPath)) fail(`${label} artifact path must not be absolute`);
  const sourcePath = path.resolve(fixtureDir, outputPath);
  const relativeToFixtureDir = path.relative(fixtureDir, sourcePath);
  if (relativeToFixtureDir.startsWith("..") || path.isAbsolute(relativeToFixtureDir)) {
    fail(`${label} artifact path escapes the fixture directory`);
  }
  let stat;
  try {
    stat = fs.statSync(sourcePath);
  } catch {
    fail(`${label} artifact is missing or unreadable: ${outputPath}`);
  }
  if (!stat.isFile()) fail(`${label} artifact is not a file: ${outputPath}`);
  try {
    fs.accessSync(sourcePath, fs.constants.R_OK);
  } catch {
    fail(`${label} artifact is unreadable: ${outputPath}`);
  }

  const filename = path.basename(outputPath);
  if (seenFilenames.has(filename)) fail(`duplicate artifact filename "${filename}"`);
  seenFilenames.add(filename);

  resolvedChecks.push({
    name: check.name,
    command: check.command,
    exitCode: check.exitCode,
    result: check.result,
    risk: check.risk,
    reviewerAction: check.reviewerAction,
    rollback: check.rollback,
    sourcePath,
    relativeArtifactPath: `artifacts/${filename}`,
  });
}

// Phase 2: the fixture is valid. Write the complete pack before exiting.
const failing = resolvedChecks.find((check) => check.exitCode !== 0);
const overallResult = failing ? "failed" : "passed";
const overallExitCode = failing ? failing.exitCode : 0;

fs.mkdirSync(path.join(outputRoot, "artifacts"), { recursive: true });

const checks = resolvedChecks.map((check) => {
  const targetPath = path.join(outputRoot, check.relativeArtifactPath);
  fs.copyFileSync(check.sourcePath, targetPath);
  const digest = sha256(fs.readFileSync(targetPath));
  return {
    name: check.name,
    command: check.command,
    exitCode: check.exitCode,
    result: check.result,
    risk: check.risk,
    reviewerAction: check.reviewerAction,
    rollback: check.rollback,
    artifact: { path: check.relativeArtifactPath, sha256: digest },
  };
});

const pack = {
  schemaVersion: 1,
  sourceSha: shaArg,
  fixtureSha256: sha256(fixtureBytes),
  overallResult,
  overallExitCode,
  checks,
};

fs.writeFileSync(path.join(outputRoot, "pr-evidence.json"), `${JSON.stringify(pack, null, 2)}\n`);

const summaryLines = [
  "# PR Evidence",
  "",
  `Source SHA: ${pack.sourceSha}`,
  `Overall result: ${pack.overallResult}`,
  `Overall exit code: ${pack.overallExitCode}`,
  "",
];
for (const check of checks) {
  summaryLines.push(
    `## ${check.name}`,
    `Command: ${check.command}`,
    `Result: ${check.result}`,
    `Exit code: ${check.exitCode}`,
    `Artifact: ${check.artifact.path}`,
    `SHA-256: ${check.artifact.sha256}`,
    `Risk: ${check.risk}`,
    `Reviewer action: ${check.reviewerAction}`,
    `Rollback: ${check.rollback}`,
    "",
  );
}

fs.writeFileSync(path.join(outputRoot, "summary.md"), `${summaryLines.join("\n")}\n`);

process.exitCode = pack.overallExitCode;
