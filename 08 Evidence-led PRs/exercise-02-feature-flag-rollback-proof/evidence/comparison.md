# Comparison: Before vs. After

## Same conditions

Both attempts started from the identical commit `52090edddf032d026ece16ef90feb627bf8e67ac`, ran as a single first-attempt Claude Code general-purpose subagent session (`claude-sonnet-5`, full tool access, no time limit imposed), received zero human hints, and were committed without correction or retry. Both patches are reproducible with `git diff --binary --full-index 52090edddf032d026ece16ef90feb627bf8e67ac <implementation-sha>` and match their recorded SHA-256 digests.

The only variable changed between them is the prompt: the before session received the bare mission paragraph; the after session received the mission plus the transcribed field/behavior spec from `docs/flag-brief.md` and `docs/rollback-contract.md`.

## Before

Commit `59fa6508dc8f3a6c8f6493acab686545c3d31a07`. The agent explored the exercise directory unprompted, read `docs/flag-brief.md` and `docs/rollback-contract.md` itself, and built a boundary and rollback CLI that pass the full protected verifier. 2 files changed (+116/-11).

## After

Fresh-agent commit `3a0b04586999a946b691600de1f74aff816c05d6`, built directly against the spec supplied in the prompt with no need to explore for the contract fields first. 2 files changed (+107/-10).

## Proof

| Check | Before | After |
|---|---|---|
| `npm run agent:check` | exit 0 | exit 0 |
| `npm run test:rollout` (6 scenario checks) | 6/6 PASS | 6/6 PASS |
| Enabled: API calls / telemetry | 1 / 1 | 1 / 1 |
| Disabled, provider-error, invalid-context, API-failure: API calls / telemetry | 0 / 0 (all four) | 0 / 0 (all four) |
| Targeting key stability (`targetingKey === accountId` passed through unchanged) | Yes | Yes |
| `npm run rollback:drill` — invalid-input check | rejected, config unchanged | rejected, config unchanged |
| `npm run rollback:drill` — interruption fault injection | rejected, config unchanged, 0 leftover files | rejected, config unchanged, 0 leftover files |
| `npm run rollback:drill` — atomic trace (lock → read → temp write → rename) | observed | observed |
| `npm run rollback:drill` — concurrency (2 overlapping commands) | 1 succeeded, 1 rejected | 1 succeeded, 1 rejected |
| Rollback elapsed time vs. 1000 ms objective | 30.9 ms | 31.0 ms |
| `npm run rollout:verify` (5 protected submission checks) | PASS (verified in isolated worktree) | PASS (`evidence/commands/rollout-verify.txt`) |
| Implementation lines added | 116 | 107 |

Full raw output: `evidence/commands/rollout-verify.txt`. Both patches: `evidence/before.patch` (SHA-256 `f68f3c7500645dd78e3b6c0f9f919ea23a82e6f743817592a6fd4b96d39bf6f4`), `evidence/after.patch` (SHA-256 `eb52336d93553087dae29fb542bb5c8af2b6a20b579410ec67774bc72c1d8e7c`).

## Conclusion

This trial did not reproduce the exercise's implicit premise that an unguided first attempt leaves an unproved gap the spec would have caught: given only the raw mission, a capable fresh agent read the same flag and rollback contract docs on its own and built a correct, verifier-passing boundary and rollback CLI without being told to. The real, measured difference is not correctness but implementation leanness — the spec-driven after session needed no exploratory reading, arrived at the exact validation-before-lock, exclusive-lock-then-recheck-then-temp-write-then-rename sequence directly from the transcribed contract, and produced a rollback script 23 lines shorter than the before attempt's for the same protected behavior. A spec-driven prompt did not prevent a capability failure here — it removed ambiguity about implementation shape, which the raw-mission prompt left the agent to work out on its own (and it worked it out correctly, just less concisely).
