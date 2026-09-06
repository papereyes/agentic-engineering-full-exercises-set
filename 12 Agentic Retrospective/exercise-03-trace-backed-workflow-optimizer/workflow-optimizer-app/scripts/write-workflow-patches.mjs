import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createSnapshotPatch } from "./workflow-submission-verification.mjs";

const appRoot = process.cwd();
const exerciseRoot = path.resolve(appRoot, "..");
const repositoryRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: appRoot, encoding: "utf8" }).trim();
const history = JSON.parse(fs.readFileSync(path.join(exerciseRoot, "evidence/history.json"), "utf8"));
for (const field of ["baselineSha", "candidateSha"]) {
  if (!/^[a-f0-9]{40}$/.test(history[field] ?? "")) throw new Error(`${field} must be a full commit SHA`);
}
const prefix = path.relative(repositoryRoot, exerciseRoot).split(path.sep).join("/");
const workflowFile = `${prefix}/workflow-optimizer-app/workflow/instructions.md`;
const baselineSource = execFileSync("git", ["show", `${history.baselineSha}:${workflowFile}`], { cwd: repositoryRoot, encoding: "utf8" });
fs.writeFileSync(path.join(exerciseRoot, "evidence/before.patch"), createSnapshotPatch(workflowFile, baselineSource));
const afterPatch = execFileSync("git", ["diff", "--binary", "--full-index", history.baselineSha, history.candidateSha, "--", workflowFile], { cwd: repositoryRoot });
fs.writeFileSync(path.join(exerciseRoot, "evidence/after.patch"), afterPatch);
console.log("PASS generated before.patch and after.patch from evidence/history.json");
