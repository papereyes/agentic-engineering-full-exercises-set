import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { selectContext } from "../src/budget/selectContext.mjs";

const catalog = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "..", "..", "docs", "context-catalog.json"), "utf8"));
const ids = (entries) => entries.map((entry) => entry.id);
const task = { tags: ["adapter", "session"], questions: ["errors"] };

const selected = selectContext(catalog, task, 2000);
assert.deepEqual(ids(selected.selected), ["repository-rules", "current-adapter-contract", "current-error-contract"], "question tags expand current context after task tags");
assert.equal(selected.totalBytes, 1867);
assert.equal(selected.remainingBytes, 133);
assert.deepEqual(selected.requestedTags, ["adapter", "errors", "session"]);
assert.deepEqual(selected.unresolvedTags, []);
assert.equal(selected.skipped.find((entry) => entry.id === "legacy-migration-notes")?.reason, "stale", "stale context never wins on priority or size");
assert.equal(selected.skipped.find((entry) => entry.id === "ui-style-guide")?.reason, "irrelevant");

const reversed = selectContext([...catalog].reverse(), { tags: ["session", "adapter"], questions: ["errors"] }, 2000);
assert.deepEqual(reversed, selected, "deterministic selection must not depend on catalog or tag order");

const tight = selectContext(catalog, { tags: ["session", "adapter"] }, 1200);
assert.deepEqual(ids(tight.selected), ["repository-rules"], "mandatory rules are selected before relevant context");
assert.equal(tight.skipped.find((entry) => entry.id === "current-adapter-contract")?.reason, "budget");
assert.deepEqual(tight.unresolvedTags, ["adapter", "session"], "budget omissions expose unresolved task tags");

assert.throws(() => selectContext(catalog, task, 488), /mandatory context/i);
assert.throws(() => selectContext([...catalog, catalog[0]], task, 2000), /duplicate context id/i);
assert.throws(() => selectContext(catalog, task, -1), /positive integer/i);
assert.equal(new Set([...selected.selected, ...selected.skipped].map((entry) => entry.id)).size, catalog.length);

console.log("PASS learner deterministic authority, budget, stale, duplicate, and question selection cases");
