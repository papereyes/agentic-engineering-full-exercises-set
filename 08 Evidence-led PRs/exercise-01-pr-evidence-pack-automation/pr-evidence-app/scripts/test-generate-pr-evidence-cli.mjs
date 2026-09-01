// Manual regression check for the symlink-escape fix in generate-pr-evidence.mjs.
// Not wired into `npm test` because package.json and test-evidence-verifier.mjs
// are protected inputs (challenge-integrity.json). Run directly:
//   node ./scripts/test-generate-pr-evidence-cli.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "generate-pr-evidence-cli-test-"));
try {
  const fixtureDir = path.join(temporary, "fixtures");
  const outsideDir = path.join(temporary, "outside");
  fs.mkdirSync(fixtureDir, { recursive: true });
  fs.mkdirSync(outsideDir, { recursive: true });

  const secretFile = path.join(outsideDir, "secret.txt");
  fs.writeFileSync(secretFile, "outside-the-fixture-directory\n");

  // A symlink that lives inside the fixture directory but resolves outside it.
  const linkPath = path.join(fixtureDir, "linked-artifact.txt");
  fs.symlinkSync(secretFile, linkPath);

  const fixture = {
    schemaVersion: 1,
    checks: [
      {
        name: "smoke",
        command: "echo ok",
        result: "passed",
        exitCode: 0,
        outputPath: "linked-artifact.txt",
        risk: "low",
        reviewerAction: "none",
        rollback: "none",
      },
    ],
  };
  const fixturePath = path.join(fixtureDir, "check-results.json");
  fs.writeFileSync(fixturePath, JSON.stringify(fixture));

  const cliPath = path.join(import.meta.dirname, "generate-pr-evidence.mjs");
  const outputDir = path.join(temporary, "output");
  const sha = "a".repeat(40);

  assert.throws(
    () => execFileSync("node", [cliPath, "--fixture", fixturePath, "--sha", sha, "--output", outputDir], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }),
    /Command failed/,
    "generator must reject an artifact that escapes the fixture directory through a symbolic link",
  );
  assert.ok(!fs.existsSync(path.join(outputDir, "pr-evidence.json")), "generator must not write output when the fixture is rejected");

  console.log("generate-pr-evidence symlink-escape rejection check passed");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
