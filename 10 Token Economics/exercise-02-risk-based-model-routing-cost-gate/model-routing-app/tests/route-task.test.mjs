import assert from "node:assert/strict";
import { routeTask } from "../src/routing/routeTask.mjs";

const cases = [
  [{ risk: "unknown", ambiguity: "low", scope: "one-file" }, "clarify"],
  [{ risk: "low", ambiguity: "high", scope: "one-file" }, "clarify"],
  [{ risk: "low", ambiguity: "low", scope: "unknown" }, "clarify"],
  [{ risk: "high", ambiguity: "low", scope: "one-file" }, "reasoning"],
  [{ risk: "low", ambiguity: "low", scope: "cross-boundary" }, "reasoning"],
  [{ risk: "medium", ambiguity: "low", scope: "one-file" }, "balanced"],
  [{ risk: "low", ambiguity: "low", scope: "three-files" }, "balanced"],
  [{ risk: "low", ambiguity: "low", scope: "one-file" }, "fast"],
  [{ risk: "low", ambiguity: "low", scope: "mechanical" }, "fast"],
];

for (const [task, expected] of cases) {
  assert.equal(routeTask({ id: `renamed-case-${expected}`, ...task }), expected, `${JSON.stringify(task)} must route to ${expected}`);
}

for (const task of [
  { ambiguity: "low", scope: "one-file" },
  { risk: "low", ambiguity: "low" },
  { risk: "urgent", ambiguity: "low", scope: "one-file" },
  { risk: "low", ambiguity: "medium", scope: "one-file" },
  { risk: "low", ambiguity: "low", scope: "six-files" },
]) assert.equal(routeTask(task), "clarify", `unknown or incomplete field combination must clarify: ${JSON.stringify(task)}`);

assert.equal(routeTask({ id: "authorization-boundary", risk: "low", ambiguity: "low", scope: "one-file" }), "fast", "case IDs must not influence routing");
assert.equal(routeTask({ risk: "high", ambiguity: "high", scope: "cross-boundary" }), "clarify", "clarification must win the tie-break over reasoning");
assert.equal(routeTask({ risk: "medium", ambiguity: "low", scope: "cross-boundary" }), "reasoning", "cross-boundary scope must win over balanced");

console.log("PASS learner route precedence and field-validation matrix");
