# After: Spec-Driven First Attempt

- Starting commit: `52090edddf032d026ece16ef90feb627bf8e67ac`
- Implementation commit: `3a0b04586999a946b691600de1f74aff816c05d6`
- Agent and model: Claude Code general-purpose subagent, `claude-sonnet-5`
- Tools and permissions: full tool access (Bash, Read, Write, Edit, Grep, Glob), same permission mode as the orchestrating session
- Time limit: None imposed
- Human hints: 0
- Retries: 0
- Prompt: the mission plus the exact field/behavior requirements transcribed from `docs/flag-brief.md` and `docs/rollback-contract.md` — flag evaluation semantics, required legacy reasons, side-effect rules, the CLI's argument list, validation order, atomic write/rename protocol, lock behavior, and the fault-injection env vars — given up front as the task specification
- Patch: `evidence/after.patch`
- Patch SHA-256: `eb52336d93553087dae29fb542bb5c8af2b6a20b579410ec67774bc72c1d8e7c`

| State | Experience | Preview API calls | Telemetry events | Check exit code |
|---|---|---:|---:|---:|
| Enabled | preview | 1 | 1 | 0 |
| Disabled | legacy | 0 | 0 | 0 |
| Provider error | legacy | 0 | 0 | 0 |
| Invalid context | legacy | 0 | 0 | 0 |
| API failure | legacy | 0 | 0 | 0 |

- Files changed: 2 (`src/rollout/invoicePreview.mjs`, `scripts/rollback-invoice-preview.mjs`)
- Lines added / removed: +107 / -10
- Rollback command exit code: 0 (successful run)
- Config digest before rollback: `d24ea840ff3a6e2302fe5e7f8066d99d4539b9ae12f3c428d1e5b324c3dfd77a`
- Config digest after rollback: `3303cee1a8128202dbc09adef17f78dd1f1d0f00b8520328f789e227e7095e97`
- Interruption result: fault-injected run (`NODE_ENV=test`, `ROLLBACK_TEST_FAIL_BEFORE_RENAME=1`) rejected with a non-zero exit, left the target byte-for-byte unchanged, and left zero temporary or lock files behind
- Concurrent command exit codes: `[0, 1]` — exactly one of two overlapping rollback attempts against the same revision succeeded
- Rollback audit path: `configAfter.lastRollback` (`{ actor, reason, timestamp, previousRevision }`), recorded in `evidence/rollback-drill.json`

## What happened

Given the mission framed as an explicit spec (every legacy reason, every side-effect rule, the exact CLI contract, the atomic write/lock protocol, and the fault-injection env vars), the agent built the corrected `loadInvoiceExperience` boundary and `scripts/rollback-invoice-preview.mjs` directly against the contract with no exploratory reading required — it never opened `docs/flag-brief.md` or `docs/rollback-contract.md` itself.

Verified at the implementation commit (`3a0b04586999a946b691600de1f74aff816c05d6`):

- `npm run agent:check` → exit 0 (49 protected inputs verified, lint, test, format, typecheck, build all pass)
- `npm run test:rollout` → exit 0, all 6 scenario checks PASS (enabled, disabled, provider-error, mismatched context, empty context, preview API error)
- `npm run rollback:drill -- --sha 3a0b0458...` → PASS: invalid-input rejection, interrupted-update fault injection, two-process concurrency check, and the full lock → read → temp-write → rename trace, all observed exactly as the protected drill requires
- `npm run rollout:verify` → exit 0, all five submission checks PASS (see `evidence/commands/rollout-verify.txt`)

## Real difference from the before attempt

Both attempts independently pass the same protected verifier at their own commit SHA — this trial did not reproduce a broken naive attempt, because the before-attempt agent read both contract docs unprompted. The measured difference is in the implementation, not the outcome:

- The before agent's rollback script is 98 added lines; the after agent's is 75 — the after agent, working from an explicit validation-order and lock/cleanup spec, produced a leaner implementation of the same atomic protocol.
- No exploratory tool calls were needed to locate the flag or rollback contract fields — the after agent's first source edit was the generator/boundary itself, built directly from the transcribed spec.
- The after agent noted and explicitly scoped its lock/temp cleanup to only files it itself acquired, rather than acquiring shared state — a detail the spec's exact wording about releasing the lock "on success or failure" made unambiguous.

See `evidence/comparison.md` for the full comparison.
