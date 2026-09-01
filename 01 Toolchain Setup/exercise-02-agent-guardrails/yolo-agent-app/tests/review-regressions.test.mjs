import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const policy = JSON.parse(await readFile(path.join(root, "guardrails/policy.json"), "utf8"));
const { evaluateAction } = await import(pathToFileURL(path.join(root, "guardrails/enforce.mjs")));
const { evaluateHookEvent } = await import(pathToFileURL(path.join(root, "guardrails/adapters/codex.mjs")));

function runHook(toolName, toolInput) {
  return evaluateHookEvent(policy, { cwd: root, tool_name: toolName, tool_input: toolInput }).decision;
}

test("reviewed guardrail bypasses stay closed", async () => {
  for (const command of [
    "cat fixtures/production-customer-*.json",
    "cd fixtures && cat production-customer-export.json"
  ]) {
    assert.equal(evaluateAction(policy, { operation: "command", path: "", command }).decision, "blocked");
  }
  assert.equal(evaluateAction(policy, { operation: "command", path: "", command: "npm run test" }).decision, "allowed");

  assert.equal(runHook("mcp__filesystem__read_file", { path: "src/App.tsx" }), "allowed");
  assert.equal(runHook("mcp__filesystem__read_file", { path: "fixtures/production-customer-export.json" }), "blocked");
  assert.equal(runHook("apply_patch", {
    command: "*** Begin Patch\n*** Update File: fixtures/production-customer-export.json\n*** End Patch"
  }), "blocked");

  const hooks = JSON.parse(await readFile(path.join(root, ".codex/hooks.json"), "utf8"));
  assert.equal(Object.hasOwn(hooks.hooks.PreToolUse[0], "matcher"), false);
});
