import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const REQUIRED_FIELDS = [
  "Starting commit",
  "Implementation commit",
  "Agent and model",
  "Tools and permissions",
  "Time limit",
  "Human hints",
  "Retries",
  "Patch SHA-256",
];

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function readFields(file, failures) {
  if (!fs.existsSync(file)) {
    failures.push(`missing ${path.basename(file)}`);
    return { text: "", fields: new Map() };
  }
  const text = fs.readFileSync(file, "utf8");
  const fields = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:[-*]\s*)?([A-Za-z][A-Za-z0-9 -]+):\s*(.+?)\s*$/);
    if (match) fields.set(match[1].trim(), match[2].replace(/^`|`$/g, "").trim());
  }
  for (const field of REQUIRED_FIELDS) if (!fields.get(field)) failures.push(`${path.basename(file)} is missing ${field}`);
  return { text, fields };
}

function git(repositoryRoot, args) {
  return execFileSync("git", args, { cwd: repositoryRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function checkPatchAtCommit({ repositoryRoot, startingCommit, patchFile, label, failures }) {
  if (!fs.existsSync(patchFile)) {
    failures.push(`missing ${path.basename(patchFile)}`);
    return;
  }
  const source = fs.readFileSync(patchFile, "utf8");
  if (!source.includes("diff --git ") || source.trim().length < 80) {
    failures.push(`${path.basename(patchFile)} is not a non-empty Git patch`);
    return;
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "exercise-evidence-"));
  try {
    git(repositoryRoot, ["worktree", "add", "--detach", temporary, startingCommit]);
    execFileSync("git", ["apply", "--check", "--whitespace=nowarn", patchFile], {
      cwd: temporary,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const detail = String(error?.stderr ?? error?.message ?? "").trim().split(/\r?\n/)[0];
    failures.push(`${label} patch does not apply to starting commit${detail ? `: ${detail}` : ""}`);
  } finally {
    try { git(repositoryRoot, ["worktree", "remove", "--force", temporary]); }
    catch { fs.rmSync(temporary, { recursive: true, force: true }); }
  }
}

function verifyCommittedRun({ repositoryRoot, startingCommit, implementationCommit, patchFile, label, failures }) {
  if (!/^[a-f0-9]{40}$/.test(implementationCommit)) {
    failures.push(`${label}.md Implementation commit must be a full 40-character Git SHA`);
    return;
  }
  try {
    git(repositoryRoot, ["cat-file", "-e", `${implementationCommit}^{commit}`]);
    git(repositoryRoot, ["merge-base", "--is-ancestor", startingCommit, implementationCommit]);
    const expectedPatch = execFileSync(
      "git",
      ["diff", "--binary", "--full-index", startingCommit, implementationCommit],
      { cwd: repositoryRoot },
    );
    if (fs.existsSync(patchFile) && !expectedPatch.equals(fs.readFileSync(patchFile))) {
      failures.push(`${label}.patch must exactly match the Git diff from Starting commit to ${label}.md Implementation commit`);
    }
  } catch {
    failures.push(`${label}.md Implementation commit must be an available descendant of Starting commit`);
  }
}

function repositoryRelative(repositoryRoot, absolute) {
  return path.relative(repositoryRoot, absolute).split(path.sep).join("/");
}

function findIntegrityManifests(directory, results = []) {
  if (!fs.existsSync(directory)) return results;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (["node_modules", ".git"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) findIntegrityManifests(absolute, results);
    else if (entry.name === "challenge-integrity.json") results.push(absolute);
  }
  return results;
}

function verifyProtectedHistory({ repositoryRoot, exerciseRoot, startingCommit, implementationCommits, failures }) {
  for (const manifestPath of findIntegrityManifests(exerciseRoot)) {
    const manifestRelative = repositoryRelative(repositoryRoot, manifestPath);
    let trustedSource;
    try { trustedSource = git(repositoryRoot, ["show", `${startingCommit}:${manifestRelative}`]); }
    catch {
      failures.push(`protected-input manifest is not present at Starting commit: ${manifestRelative}`);
      continue;
    }
    const currentSource = fs.readFileSync(manifestPath, "utf8").replaceAll("\r\n", "\n").trim();
    if (currentSource !== trustedSource.replaceAll("\r\n", "\n").trim()) {
      failures.push(`protected-input manifest changed after Starting commit: ${manifestRelative}`);
      continue;
    }
    const trusted = JSON.parse(trustedSource);
    for (const relative of Object.keys(trusted.protectedFiles ?? {})) {
      const absolute = path.resolve(path.dirname(manifestPath), relative);
      const protectedRelative = repositoryRelative(repositoryRoot, absolute);
      try {
        const expected = execFileSync("git", ["show", `${startingCommit}:${protectedRelative}`], { cwd: repositoryRoot });
        const expectedNormalized = expected.toString("utf8").replaceAll("\r\n", "\n");
        const currentNormalized = fs.existsSync(absolute) ? fs.readFileSync(absolute, "utf8").replaceAll("\r\n", "\n") : null;
        if (currentNormalized === null || expectedNormalized !== currentNormalized) {
          failures.push(`protected input changed after Starting commit: ${protectedRelative}`);
        }
      } catch {
        failures.push(`protected input is not available at Starting commit: ${protectedRelative}`);
      }
    }

    for (const revision of implementationCommits) {
      try {
        const recordedManifest = git(repositoryRoot, ["show", `${revision}:${manifestRelative}`]);
        if (recordedManifest.replaceAll("\r\n", "\n").trim() !== trustedSource.replaceAll("\r\n", "\n").trim()) {
          failures.push(`protected-input manifest changed in recorded implementation ${revision}: ${manifestRelative}`);
          continue;
        }
      } catch {
        failures.push(`protected-input manifest is missing from recorded implementation ${revision}: ${manifestRelative}`);
        continue;
      }
      for (const relative of Object.keys(trusted.protectedFiles ?? {})) {
        const absolute = path.resolve(path.dirname(manifestPath), relative);
        const protectedRelative = repositoryRelative(repositoryRoot, absolute);
        try {
          const expected = execFileSync("git", ["show", `${startingCommit}:${protectedRelative}`], { cwd: repositoryRoot });
          const recorded = execFileSync("git", ["show", `${revision}:${protectedRelative}`], { cwd: repositoryRoot });
          if (!expected.equals(recorded)) failures.push(`protected input changed in recorded implementation ${revision}: ${protectedRelative}`);
        } catch {
          failures.push(`protected input is missing from recorded implementation ${revision}: ${protectedRelative}`);
        }
      }
    }
  }
}

function verifyRunBaseScope({ repositoryRoot, exerciseRoot, startingCommit, runBaseCommit, label, allowedAfterRunBaseFiles, failures }) {
  if (label === "before" && runBaseCommit !== startingCommit) {
    failures.push("before.md Run base commit must equal Starting commit");
    return;
  }
  if (label !== "after" || runBaseCommit === startingCommit) return;
  try {
    if (git(repositoryRoot, ["rev-parse", `${runBaseCommit}^`]) !== startingCommit) failures.push("after.md Run base commit must directly follow Starting commit");
    const prefix = repositoryRelative(repositoryRoot, exerciseRoot);
    const allowed = new Set(allowedAfterRunBaseFiles.map((relative) => `${prefix}/${relative}`));
    const changed = git(repositoryRoot, ["diff", "--name-only", startingCommit, runBaseCommit]).split(/\r?\n/).filter(Boolean);
    if (!changed.length) failures.push("after.md Run base commit must contain the documented participant intervention");
    if (!allowed.size) failures.push("after.md uses a different Run base commit but this exercise has no allowed intervention files");
    for (const file of changed) if (!allowed.has(file)) failures.push(`after.md Run base commit changes unauthorized file ${file}`);
  } catch {
    failures.push("after.md Run base commit must be a direct descendant containing only the allowed participant intervention");
  }
}

export function verifyEvidenceOnlyHistory({ repositoryRoot, exerciseRoot, fromCommit }) {
  const failures = [];
  try {
    const prefix = `${repositoryRelative(repositoryRoot, exerciseRoot)}/evidence/`;
    const lines = git(repositoryRoot, ["rev-list", "--reverse", "--parents", `${fromCommit}..HEAD`]).split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const [commit, ...parents] = line.split(" ");
      if (parents.length !== 1) failures.push(`commit ${commit} after implementation must not be a merge commit`);
      const changed = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", commit]).split(/\r?\n/).filter(Boolean);
      for (const file of changed) if (!file.startsWith(prefix)) failures.push(`commit ${commit} after implementation changes non-evidence file ${file}`);
    }
  } catch {
    failures.push("unable to verify evidence-only commits after implementation");
  }
  return failures;
}

function validateRun({ label, record, patchFile, failures }) {
  const expectedHash = record.fields.get("Patch SHA-256") ?? "";
  if (!/^[a-f0-9]{64}$/.test(expectedHash)) failures.push(`${label}.md Patch SHA-256 must be 64 lowercase hexadecimal characters`);
  else if (fs.existsSync(patchFile) && sha256(patchFile) !== expectedHash) failures.push(`${label}.md Patch SHA-256 does not match ${label}.patch`);
  if (record.fields.get("Human hints") !== "0") failures.push(`${label}.md must record Human hints: 0`);
  if (record.fields.get("Retries") !== "0") failures.push(`${label}.md must record Retries: 0`);
}

function verifyCommandTranscripts({ repositoryRoot, evidenceRoot, failures }) {
  const commandRoot = path.join(evidenceRoot, "commands");
  if (!fs.existsSync(commandRoot)) return;
  for (const entry of fs.readdirSync(commandRoot, { withFileTypes: true })) {
    if (!entry.isFile() || path.extname(entry.name) !== ".txt") continue;
    const label = `commands/${entry.name}`;
    const source = fs.readFileSync(path.join(commandRoot, entry.name), "utf8").replaceAll("\r\n", "\n");
    if (!["Command:", "Repository commit:", "Started at:", "Finished at:", "Duration ms:"].some((marker) => source.includes(marker))) continue;
    const field = (name) => source.match(new RegExp(`^${name}: (.+)$`, "m"))?.[1]?.trim() ?? "";
    if (field("Command") !== "npm run evidence:verify") failures.push(`${label} must capture exactly npm run evidence:verify`);
    const revision = field("Repository commit");
    if (!/^[a-f0-9]{40}$/.test(revision)) failures.push(`${label} needs a full Repository commit SHA`);
    else {
      try { git(repositoryRoot, ["merge-base", "--is-ancestor", revision, "HEAD"]); }
      catch { failures.push(`${label} Repository commit must be an ancestor of HEAD`); }
    }
    const startedAt = Date.parse(field("Started at"));
    const finishedAt = Date.parse(field("Finished at"));
    const duration = Number(field("Duration ms"));
    if (!Number.isFinite(startedAt) || !Number.isFinite(finishedAt) || finishedAt < startedAt) failures.push(`${label} needs ordered ISO timestamps`);
    if (!Number.isInteger(duration) || duration < 0 || (Number.isFinite(startedAt) && Number.isFinite(finishedAt) && duration !== finishedAt - startedAt)) failures.push(`${label} Duration ms must match its timestamps`);
    if (!/(?:^|\n)exit code: 0\n?$/.test(source)) failures.push(`${label} must end with exit code: 0`);
  }
}

export function verifyComparableEvidence({ repositoryRoot, exerciseRoot, allowIdenticalPatches = false, skipPatchHistory = false, allowedAfterRunBaseFiles = [] }) {
  const failures = [];
  const evidenceRoot = path.join(exerciseRoot, "evidence");
  const beforeFile = path.join(evidenceRoot, "before.md");
  const afterFile = path.join(evidenceRoot, "after.md");
  const beforePatch = path.join(evidenceRoot, "before.patch");
  const afterPatch = path.join(evidenceRoot, "after.patch");
  const comparisonFile = path.join(evidenceRoot, "comparison.md");
  const before = readFields(beforeFile, failures);
  const after = readFields(afterFile, failures);

  validateRun({ label: "before", record: before, patchFile: beforePatch, failures });
  validateRun({ label: "after", record: after, patchFile: afterPatch, failures });
  verifyCommandTranscripts({ repositoryRoot, evidenceRoot, failures });

  for (const field of ["Starting commit", "Agent and model", "Tools and permissions", "Time limit"]) {
    const beforeValue = before.fields.get(field);
    const afterValue = after.fields.get(field);
    if (beforeValue && afterValue && beforeValue !== afterValue) failures.push(`before.md and after.md must use the same ${field}`);
  }

  const startingCommit = before.fields.get("Starting commit") ?? "";
  if (!/^[a-f0-9]{40}$/.test(startingCommit)) failures.push("Starting commit must be a full 40-character Git SHA");
  else {
    try { git(repositoryRoot, ["cat-file", "-e", `${startingCommit}^{commit}`]); }
    catch { failures.push("Starting commit is not available in Git history"); }
    if (!skipPatchHistory) {
      for (const [label, record, patchFile] of [["before", before, beforePatch], ["after", after, afterPatch]]) {
        const runBaseCommit = record.fields.get("Run base commit") ?? startingCommit;
        if (!/^[a-f0-9]{40}$/.test(runBaseCommit)) {
          failures.push(`${label}.md Run base commit must be a full 40-character Git SHA`);
          continue;
        }
        try { git(repositoryRoot, ["merge-base", "--is-ancestor", startingCommit, runBaseCommit]); }
        catch { failures.push(`${label}.md Run base commit must descend from Starting commit`); }
        verifyRunBaseScope({ repositoryRoot, exerciseRoot, startingCommit, runBaseCommit, label, allowedAfterRunBaseFiles, failures });
        checkPatchAtCommit({ repositoryRoot, startingCommit: runBaseCommit, patchFile, label, failures });
        verifyCommittedRun({ repositoryRoot, startingCommit: runBaseCommit, implementationCommit: record.fields.get("Implementation commit") ?? "", patchFile, label, failures });
      }
    }
    const implementationCommits = [before, after]
      .map((record) => record.fields.get("Implementation commit") ?? "")
      .filter((revision) => /^[a-f0-9]{40}$/.test(revision));
    verifyProtectedHistory({ repositoryRoot, exerciseRoot, startingCommit, implementationCommits, failures });
  }

  if (!allowIdenticalPatches && fs.existsSync(beforePatch) && fs.existsSync(afterPatch) && fs.readFileSync(beforePatch).equals(fs.readFileSync(afterPatch))) failures.push("before.patch and after.patch must not be identical");

  const implementationCommit = after.fields.get("Implementation commit") ?? "";
  if (/^[a-f0-9]{40}$/.test(implementationCommit)) {
    try {
      git(repositoryRoot, ["merge-base", "--is-ancestor", implementationCommit, "HEAD"]);
    } catch { failures.push("Implementation commit must be an available descendant of Starting commit and an ancestor of HEAD"); }
  }

  if (!fs.existsSync(comparisonFile)) failures.push("missing comparison.md");
  else {
    const comparison = fs.readFileSync(comparisonFile, "utf8").toLowerCase();
    for (const term of ["before", "after", "same conditions", "proof", "conclusion"]) if (!comparison.includes(term)) failures.push(`comparison.md is missing ${term}`);
  }

  return [...new Set(failures)];
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const exerciseRoot = path.resolve(process.argv[2] ?? "..");
  const allowIdenticalPatches = process.argv.includes("--allow-identical-patches");
  const skipPatchHistory = process.argv.includes("--skip-patch-history");
  const allowedAfterRunBaseFiles = process.argv
    .filter((argument) => argument.startsWith("--after-run-base-file="))
    .map((argument) => argument.slice("--after-run-base-file=".length));
  const repositoryRoot = git(exerciseRoot, ["rev-parse", "--show-toplevel"]);
  const failures = verifyComparableEvidence({ repositoryRoot, exerciseRoot, allowIdenticalPatches, skipPatchHistory, allowedAfterRunBaseFiles });
  if (failures.length) {
    console.error(`Comparable evidence verification failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
    process.exit(1);
  }
  console.log(skipPatchHistory
    ? "PASS before and after runs use matching conditions and hashed snapshot patches"
    : "PASS before and after runs use matching conditions and valid Git patches");
  console.log(skipPatchHistory ? "PASS exercise-specific history verifier owns patch-to-commit validation" : "PASS both patches match their recorded implementation commits");
  console.log("PASS protected manifests and inputs match the starting commit");
  if (allowIdenticalPatches) console.log("PASS identical first-attempt patches are allowed by this exercise contract");
}
