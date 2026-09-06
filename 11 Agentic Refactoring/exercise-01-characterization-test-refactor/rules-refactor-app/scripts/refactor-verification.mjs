import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { verifyEvidenceOnlyHistory } from "../../../../scripts/comparable-evidence.mjs";

function git(root, args) { return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim(); }
export function verifyRefactorHistory({ repositoryRoot, exerciseRoot, characterizationSha, refactorSha }) {
  const failures = [];
  try {
    if (git(repositoryRoot, ["rev-parse", `${refactorSha}^`]) !== characterizationSha) failures.push("refactorSha must directly follow characterizationSha");
    git(repositoryRoot, ["merge-base", "--is-ancestor", refactorSha, "HEAD"]);
    const prefix = path.relative(repositoryRoot, exerciseRoot).split(path.sep).join("/");
    const characterizationFiles = [`${prefix}/evidence/before-output.json`, `${prefix}/rules-refactor-app/src/rules/legacyEligibility.characterization.test.mjs`].sort();
    const actualCharacterization = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", characterizationSha]).split(/\r?\n/).filter(Boolean).sort();
    if (JSON.stringify(actualCharacterization) !== JSON.stringify(characterizationFiles)) failures.push("characterizationSha must contain only public characterization test and before output");
    const testSource = execFileSync("git", ["show", `${characterizationSha}:${characterizationFiles[1]}`], { cwd: repositoryRoot, encoding: "utf8" });
    const executableTest = testSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    if (!executableTest.includes("evaluateRenewalEligibility") || !executableTest.includes("renewal-golden-cases") || !executableTest.includes("deepEqual") || /from\s+["'][^"']*(helper|internal)/i.test(executableTest)) failures.push("characterization test must execute the public rule against the protected golden cases");
    const refactorFile = `${prefix}/rules-refactor-app/src/rules/legacyEligibility.mjs`;
    const actualRefactor = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", refactorSha]).split(/\r?\n/).filter(Boolean);
    if (actualRefactor.length !== 1 || actualRefactor[0] !== refactorFile) failures.push("refactorSha must change only legacyEligibility.mjs");
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "characterization-sensitivity-"));
    try {
      const testPath = path.join(temporary, ...characterizationFiles[1].split("/").slice(-5));
      const sourcePath = path.join(path.dirname(testPath), "legacyEligibility.mjs");
      const fixturePath = path.join(temporary, "exercise", "docs", "renewal-golden-cases.json");
      fs.mkdirSync(path.dirname(testPath), { recursive: true });
      fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
      fs.writeFileSync(testPath, testSource);
      fs.writeFileSync(sourcePath, execFileSync("git", ["show", `${refactorSha}:${refactorFile}`], { cwd: repositoryRoot }));
      const fixtureSource = execFileSync("git", ["show", `${characterizationSha}:${prefix}/docs/renewal-golden-cases.json`], { cwd: repositoryRoot, encoding: "utf8" });
      fs.writeFileSync(fixturePath, fixtureSource);
      const passing = spawnSync(process.execPath, [testPath], { cwd: temporary, encoding: "utf8" });
      if (passing.status !== 0) failures.push("participant characterization test must pass against refactorSha");
      const mutated = JSON.parse(fixtureSource);
      mutated[0].expected = { ...mutated[0].expected, discountPercent: 99 };
      fs.writeFileSync(fixturePath, `${JSON.stringify(mutated, null, 2)}\n`);
      const mutationRun = spawnSync(process.execPath, [testPath], { cwd: temporary, encoding: "utf8" });
      if (mutationRun.status === 0) failures.push("participant characterization test must detect a changed protected observation");
    } finally {
      fs.rmSync(temporary, { recursive: true, force: true });
    }
    failures.push(...verifyEvidenceOnlyHistory({ repositoryRoot, exerciseRoot, fromCommit: refactorSha }));
  } catch { failures.push("characterizationSha must precede a focused ancestor refactorSha"); }
  return failures;
}

export function verifyOutputs(before, after, cases) {
  const failures = [];
  if (JSON.stringify(before) !== JSON.stringify(after)) failures.push("before and after outputs are not identical");
  if (!Array.isArray(before) || before.length !== cases.length) failures.push("output snapshots must cover every golden case");
  for (let index = 0; index < cases.length; index += 1) {
    if (before?.[index]?.name !== cases[index].name || JSON.stringify(before?.[index]?.input) !== JSON.stringify(cases[index].input) || JSON.stringify(before?.[index]?.output) !== JSON.stringify(cases[index].expected)) failures.push(`snapshot mismatch for ${cases[index].name}`);
  }
  return failures;
}
