import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "capture-verification-test-"));
try {
  const appRoot = path.join(temporary, "exercise", "app");
  fs.mkdirSync(appRoot, { recursive: true });
  fs.writeFileSync(path.join(appRoot, "package.json"), JSON.stringify({
    private: true,
    scripts: { "evidence:verify": "node -e \"console.log('PASS sample verification')\"" },
  }));
  const output = path.join(temporary, "exercise", "evidence", "commands", "verify.txt");
  const command = process.execPath;
  const script = path.resolve(import.meta.dirname, "capture-verification.mjs");
  const result = spawnSync(command, [script, "--output", "../evidence/commands/verify.txt", "--", "npm", "run", "evidence:verify"], {
    cwd: appRoot,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const transcript = fs.readFileSync(output, "utf8");
  assert.match(transcript, /PASS sample verification/);
  assert.match(transcript, /exit code: 0/);
  assert.match(transcript, /Started at:/);
  assert.match(transcript, /Repository commit:/);
  assert.match(transcript, /Command: npm run evidence:verify/);

  const arbitrary = spawnSync(command, [script, "--output", "../evidence/commands/fake.txt", "--", command, "-e", "console.log('PASS')"], {
    cwd: appRoot,
    encoding: "utf8",
  });
  assert.equal(arbitrary.status, 2);
  assert.match(arbitrary.stderr, /must be exactly: npm run evidence:verify/);

  const outside = path.join(temporary, "outside");
  const linkedCommands = path.join(temporary, "exercise", "evidence", "linked-commands");
  fs.mkdirSync(outside);
  try {
    fs.symlinkSync(outside, linkedCommands, process.platform === "win32" ? "junction" : "dir");
    const escaped = spawnSync(command, [script, "--output", "../evidence/linked-commands/escape.txt", "--", "npm", "run", "evidence:verify"], {
      cwd: appRoot,
      encoding: "utf8",
    });
    assert.equal(escaped.status, 2);
    assert.match(escaped.stderr, /must not escape evidence/);
    assert.equal(fs.existsSync(path.join(outside, "escape.txt")), false);
  } catch (error) {
    if (error?.code !== "EPERM") throw error;
  }

  const outsideFile = path.join(temporary, "outside-file.txt");
  const linkedFile = path.join(temporary, "exercise", "evidence", "commands", "linked-file.txt");
  fs.writeFileSync(outsideFile, "do not replace\n");
  try {
    fs.symlinkSync(outsideFile, linkedFile, "file");
    const escapedFile = spawnSync(command, [script, "--output", "../evidence/commands/linked-file.txt", "--", "npm", "run", "evidence:verify"], {
      cwd: appRoot,
      encoding: "utf8",
    });
    assert.equal(escapedFile.status, 2);
    assert.match(escapedFile.stderr, /must not be a symbolic link/);
    assert.equal(fs.readFileSync(outsideFile, "utf8"), "do not replace\n");
  } catch (error) {
    if (error?.code !== "EPERM") throw error;
  }
  console.log("Verification capture self-test passed");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
