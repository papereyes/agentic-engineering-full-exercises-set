# After: Spec-Driven First Attempt

- Starting commit: `52090edddf032d026ece16ef90feb627bf8e67ac`
- Implementation commit: `2f719be07e54362969a43abf20f8ab22b9c3b111`
- Agent and model: Claude Code general-purpose subagent, `claude-sonnet-5`
- Tools and permissions: full tool access (Bash, Read, Write, Edit, Grep, Glob), same permission mode as the orchestrating session
- Time limit: None imposed
- Actual elapsed session time: 259.7s (4m20s)
- Human hints: 0
- Retries: 0
- Prompt: the mission plus the exact field/behavior requirements transcribed from `docs/evidence-contract.md`, `docs/evidence-fixtures.md`, and `docs/pr-brief.md`, and the pinned action SHAs from `docs/action-pins.json`, given up front as the task specification
- Patch: `evidence/after.patch`
- Patch SHA-256: `d219ed81774f361f3cb141dea6c42423fab46e2ba258aba4770b4170a7e8d5f0`

| Proof | Result |
|---|---|
| Failed checks preserved | 1 out of 1 |
| Commands with exit codes | 3 out of 3 |
| Artifacts copied and hashed | 3 out of 3 |
| Risk, reviewer action, and rollback present | Yes |
| Generator exit code | 1 |
| Files changed | 2 |
| Lines added and removed | +208 / -0 |

## What happened

Given the mission framed as an explicit spec (every required JSON field,
every rejection case, every workflow control, the exact action-pin SHAs),
the agent built the generator and workflow directly against the contract
with no exploratory reading required.

The fresh agent's own commit was `20a822f09654d1bfd5d618db4b19f12125920720`. One
one-line review fix was applied on top before finalizing evidence: the
generator used `process.exit(pack.overallExitCode)`, which the submission
contract requires as `process.exitCode = pack.overallExitCode` instead (the
safer pattern — `process.exit()` can truncate buffered output before the
process actually exits). This did not change `overallExitCode` semantics or
any other behavior. The recorded implementation commit,
`2f719be07e54362969a43abf20f8ab22b9c3b111`, is the agent's commit plus that
one fix, committed separately and visibly rather than folded in.

Verified at the implementation commit (`2f719be...`):

- `npm run agent:check` → exit 0
- `npm run evidence:generate -- --sha 2f719be...` → exit 1 (fixture's real failure preserved)
- `npm run evidence:verify` → exit 0, all six checks PASS

## Real difference from the before attempt

Both attempts independently pass the same protected verifier at their own
commit SHA — this trial did not reproduce a broken naive attempt, because
the before-attempt agent read the same contract docs unprompted. The
measured difference is in the implementation, not the outcome:

- Files touched: 2 (generator + workflow only) vs. 9 (before also committed
  its own self-test evidence output alongside the implementation, since it
  was not told to separate them).
- Session time: after finished ~25s faster with the spec supplied up front,
  despite writing more thorough per-field rejection messages in its own
  code style.
- No exploratory tool calls were needed to locate the contract fields —
  the after agent's first file write was the generator itself.

See `evidence/comparison.md` for the full comparison.
