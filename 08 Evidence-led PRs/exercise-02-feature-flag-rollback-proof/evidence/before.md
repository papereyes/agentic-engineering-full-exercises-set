# Before: Naive First Attempt

- Starting commit: `52090edddf032d026ece16ef90feb627bf8e67ac`
- Implementation commit: `59fa6508dc8f3a6c8f6493acab686545c3d31a07`
- Agent and model: Claude Code general-purpose subagent, `claude-sonnet-5`
- Tools and permissions: full tool access (Bash, Read, Write, Edit, Grep, Glob), same permission mode as the orchestrating session
- Time limit: None imposed
- Human hints: 0
- Retries: 0
- Prompt: the bare mission paragraph from the exercise README only — no mention of `docs/flag-brief.md`, `docs/rollback-contract.md`, `docs/evidence-contract.md`, or any field/behavior spec
- Patch: `evidence/before.patch`
- Patch SHA-256: `f68f3c7500645dd78e3b6c0f9f919ea23a82e6f743817592a6fd4b96d39bf6f4`

| State | Experience | Preview API calls | Telemetry events | Check exit code |
|---|---|---:|---:|---:|
| Enabled | preview | 1 | 1 | 0 |
| Disabled | legacy | 0 | 0 | 0 |
| Provider error | legacy | 0 | 0 | 0 |
| Invalid context | legacy | 0 | 0 | 0 |
| API failure | legacy | 1 | 0 | 0 |

- Files changed: 2 (`src/rollout/invoicePreview.mjs`, `scripts/rollback-invoice-preview.mjs`)
- Lines added / removed: +116 / -11
- Rollback command exit code: 0 (successful run)
- Config digest before rollback: `d24ea840ff3a6e2302fe5e7f8066d99d4539b9ae12f3c428d1e5b324c3dfd77a`
- Config digest after rollback: `3303cee1a8128202dbc09adef17f78dd1f1d0f00b8520328f789e227e7095e97`
- Interruption result: fault-injected run (`NODE_ENV=test`, `ROLLBACK_TEST_FAIL_BEFORE_RENAME=1`) rejected with a non-zero exit, left the target byte-for-byte unchanged, and left zero temporary or lock files behind
- Concurrent command exit codes: `[1, 0]` — exactly one of two overlapping rollback attempts against the same revision succeeded
- Rollback audit path: `configAfter.lastRollback` (`{ actor, reason, timestamp, previousRevision }`) — observed by re-running `npm run rollback:drill` against this commit in an isolated worktree (not committed as part of this branch's evidence); structurally identical to the after attempt's committed `evidence/rollback-drill.json`

## What happened

Given only the raw mission (no docs pointed to, no field spec, no CLI contract), the agent chose on its own to open `docs/flag-brief.md` and `docs/rollback-contract.md` before writing any code, then implemented a corrected `loadInvoiceExperience` boundary and a new `scripts/rollback-invoice-preview.mjs` against those contracts without being told they existed.

Re-run in isolation against its own implementation commit (`59fa6508dc8f3a6c8f6493acab686545c3d31a07`, worktree at `/tmp/before-check-08-02`):

- `npm run agent:check` → exit 0 (49 protected inputs verified, lint, test, format, typecheck, build all pass)
- `npm run test:rollout` → exit 0, all 6 scenario checks PASS (enabled, disabled, provider-error, mismatched context, empty context, preview API error)
- `npm run rollback:drill -- --sha 59fa6508...` → PASS: invalid-input rejection, interrupted-update fault injection, two-process concurrency check, and the full lock → read → temp-write → rename trace, all observed exactly as the protected drill requires

The exercise's premise — that an unguided first attempt is likely to leave a gap the spec would have caught — did not materialize in this trial: this agent independently found and followed both contract documents without being told they existed.
