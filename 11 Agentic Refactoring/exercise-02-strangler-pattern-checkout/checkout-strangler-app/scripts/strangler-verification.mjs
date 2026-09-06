import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { verifyEvidenceOnlyHistory } from "../../../../scripts/comparable-evidence.mjs";

function git(root, args) { return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim(); }

function materializeCheckoutFiles(repositoryRoot, revision, prefix, destination) {
  const files = git(repositoryRoot, ["ls-tree", "-r", "--name-only", revision, "--", `${prefix}/checkout-strangler-app/src/checkout`]).split(/\r?\n/).filter(Boolean);
  for (const file of files) {
    const target = path.join(destination, ...file.split("/"));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, execFileSync("git", ["show", `${revision}:${file}`], { cwd: repositoryRoot }));
  }
}

export function verifyStranglerHistory({ repositoryRoot, exerciseRoot, characterizationSha, sourceSha }) {
  const failures = [];
  try {
    if (git(repositoryRoot, ["rev-parse", `${sourceSha}^`]) !== characterizationSha) failures.push("sourceSha must directly follow characterizationSha");
    git(repositoryRoot, ["merge-base", "--is-ancestor", sourceSha, "HEAD"]);
    const prefix = path.relative(repositoryRoot, exerciseRoot).split(path.sep).join("/");
    const testFile = `${prefix}/checkout-strangler-app/src/checkout/checkoutRouter.test.mjs`;
    const characterizationFiles = [testFile];
    const actualCharacterization = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", characterizationSha]).split(/\r?\n/).filter(Boolean);
    if (JSON.stringify(actualCharacterization) !== JSON.stringify(characterizationFiles)) failures.push("characterizationSha must add only checkoutRouter.test.mjs");
    const participantTest = execFileSync("git", ["show", `${characterizationSha}:${testFile}`], { cwd: repositoryRoot, encoding: "utf8" });
    const executableTest = participantTest.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    for (const term of ["checkoutRouter", "assert", "card", "authorizationCreated"]) {
      if (!executableTest.includes(term)) failures.push(`participant test must exercise public router behavior for ${term}`);
    }
    if (executableTest.includes("cardCheckout.mjs")) failures.push("participant test must use the public router rather than import the new card slice directly");
    const expectedSource = [
      `${prefix}/checkout-strangler-app/src/checkout/cardCheckout.mjs`,
      `${prefix}/checkout-strangler-app/src/checkout/checkoutRouter.mjs`,
    ].sort();
    const actual = git(repositoryRoot, ["diff-tree", "--no-commit-id", "--name-only", "-r", sourceSha]).split(/\r?\n/).filter(Boolean).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expectedSource)) failures.push("sourceSha must contain only the card slice and router");

    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "strangler-test-history-"));
    try {
      materializeCheckoutFiles(repositoryRoot, characterizationSha, prefix, path.join(temporary, "red"));
      materializeCheckoutFiles(repositoryRoot, sourceSha, prefix, path.join(temporary, "green"));
      const relativeTest = testFile.split("/");
      const red = spawnSync(process.execPath, [path.join(temporary, "red", ...relativeTest)], { encoding: "utf8" });
      if (red.status === 0) failures.push("participant test must fail at characterizationSha before implementation");
      const green = spawnSync(process.execPath, [path.join(temporary, "green", ...relativeTest)], { encoding: "utf8" });
      if (green.status !== 0) failures.push("participant test must pass at sourceSha without being edited");
    } finally {
      fs.rmSync(temporary, { recursive: true, force: true });
    }
    failures.push(...verifyEvidenceOnlyHistory({ repositoryRoot, exerciseRoot, fromCommit: sourceSha }));
  } catch { failures.push("characterizationSha and sourceSha must be ordered full ancestor commits in this repository"); }
  return failures;
}

export function validateRouteMatrix(text) {
  const failures = [];
  for (const term of ["card", "gift-card", "invoice", "unknown", "flag off", "pre-authorization", "ambiguous", "legacy", "new slice"]) {
    if (!text.toLowerCase().includes(term)) failures.push(`route matrix is missing ${term}`);
  }
  return failures;
}
