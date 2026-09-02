import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, symlink, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const adapterPath = path.join(root, "guardrails/adapters/codex.mjs");
const policy = JSON.parse(await readFile(path.join(root, "guardrails/policy.json"), "utf8"));
const { createAuditRecord, evaluateAction } = await import(
  pathToFileURL(path.join(root, "guardrails/enforce.mjs"))
);

function runHook(toolName, toolInput, approvalFile = "") {
  const event = JSON.stringify({ cwd: root, tool_name: toolName, tool_input: toolInput });
  const env = { ...process.env, GUARDRAIL_APPROVAL_FILE: approvalFile };
  delete env.NODE_TEST_CONTEXT;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [adapterPath, "--hook"], {
      cwd: root,
      env,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (exitCode) => {
      if (exitCode || stderr || !stdout) return reject(new Error(`hook exited ${exitCode}: ${stderr}`));
      resolve({ exitCode, stderr, output: JSON.parse(stdout) });
    });
    child.stdin.end(event);
  });
}

function decision(run) {
  return run.output.hookSpecificOutput.permissionDecision;
}

test("reviewed guardrail bypasses stay closed", async () => {
  for (const command of [
    "cat fixtures/production-customer-*.json",
    "cd fixtures && cat production-customer-export.json"
  ]) {
    assert.equal(evaluateAction(policy, { operation: "command", path: "", command }).decision, "blocked");
  }
  assert.equal(evaluateAction(policy, { operation: "command", path: "", command: "npm run test" }).decision, "allowed");

  const canary = JSON.parse(
    await readFile(path.join(root, "fixtures/production-customer-export.json"), "utf8")
  ).canary;
  for (const field of ["operation", "path", "command", "prompt", "symlinkTarget", "content"]) {
    const record = createAuditRecord(
      { operation: "read", path: "src/App.tsx", [field]: canary },
      { decision: "blocked", reason: canary }
    );
    assert.ok(!JSON.stringify(record).includes(canary), `audit leaked the canary from ${field}`);
  }

  const safePatch = await runHook("apply_patch", {
    command: "*** Begin Patch\n*** Update File: src/App.tsx\n*** End Patch"
  });
  assert.deepEqual([safePatch.exitCode, safePatch.stderr, decision(safePatch)], [0, "", "allow"]);
  const protectedRead = await runHook("mcp__filesystem__read_file", {
    path: "fixtures/production-customer-export.json"
  });
  assert.equal(decision(protectedRead), "deny");

  const mixedPatch = await runHook("apply_patch", {
    command: [
      "*** Begin Patch",
      "*** Update File: src/App.tsx",
      "*** Update File: fixtures/production-customer-export.json",
      "*** End Patch"
    ].join("\n")
  });
  assert.equal(decision(mixedPatch), "deny");
  const movedPatch = await runHook("apply_patch", {
    command: [
      "*** Begin Patch",
      "*** Update File: src/App.tsx",
      "*** Move to: fixtures/production-customer-export.json",
      "*** End Patch"
    ].join("\n")
  });
  assert.equal(decision(movedPatch), "deny");

  const linkPath = path.join(root, "src/restricted-link");
  try {
    await symlink("../fixtures/production-customer-export.json", linkPath);
    const linkedRead = await runHook("mcp__filesystem__read_file", { path: "src/restricted-link" });
    assert.equal(decision(linkedRead), "deny");
  } finally {
    await unlink(linkPath).catch(() => {});
  }

  const approvalDirectory = await mkdtemp(path.join(tmpdir(), "guardrail-approval-"));
  const approvalFile = path.join(approvalDirectory, "approval.json");
  const generatedPatch = {
    command: "*** Begin Patch\n*** Update File: generated/api-client.ts\n*** End Patch"
  };
  try {
    assert.equal(decision(await runHook("apply_patch", generatedPatch)), "deny");
    await writeFile(
      approvalFile,
      JSON.stringify({ actions: [{ operation: "edit", path: "generated/api-client.ts" }] })
    );
    assert.equal(decision(await runHook("apply_patch", generatedPatch, approvalFile)), "allow");
  } finally {
    await rm(approvalDirectory, { recursive: true, force: true });
  }

  assert.equal(decision(await runHook("update_plan", {})), "deny");
  const hooks = JSON.parse(await readFile(path.join(root, ".codex/hooks.json"), "utf8"));
  assert.equal(Object.hasOwn(hooks.hooks.PreToolUse[0], "matcher"), false);
});
