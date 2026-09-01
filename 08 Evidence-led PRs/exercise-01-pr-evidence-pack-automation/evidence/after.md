# After: Spec-Driven First Attempt

- Starting commit: `52090edddf032d026ece16ef90feb627bf8e67ac`
- Implementation commit: `20a822f09654d1bfd5d618db4b19f12125920720`
- Agent and model: Claude Code general-purpose subagent, `claude-sonnet-5`
- Tools and permissions: full tool access (Bash, Read, Write, Edit, Grep, Glob), same permission mode as the orchestrating session
- Time limit: None imposed
- Actual elapsed session time: 259.7s (4m20s)
- Human hints: 0
- Retries: 0
- Prompt: the mission plus the exact field/behavior requirements transcribed from `docs/evidence-contract.md`, `docs/evidence-fixtures.md`, and `docs/pr-brief.md`, and the pinned action SHAs from `docs/action-pins.json`, given up front as the task specification
- Patch: `evidence/after.patch`
- Patch SHA-256: `90b42400395cd97ca498256f8729d8adaf02dd3b6315a5d64bde68e963b29a6e`

The Implementation commit above is the fresh agent's own commit, untouched.
Corrections applied afterward are recorded separately, below, under
"Post-review fixes" — they are not folded into this commit.

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

Verified at the implementation commit (`20a822f...`, the fresh agent's own
untouched commit):

- `npm run agent:check` → exit 0 (lint, test, format, typecheck, build, and
  protected-input integrity all pass)
- `npm run evidence:generate -- --sha 20a822f...` → exit 1 (fixture's real
  failure preserved)
- `npm run evidence:verify` → exit 0, all checks PASS
- `npm run test:submission` → **fails**: `scripts/generate-pr-evidence.mjs
  is missing required content: process.exitCode`. Despite being given the
  exact CLI contract up front, the agent wrote
  `process.exit(pack.overallExitCode)` instead of
  `process.exitCode = pack.overallExitCode`. Functionally the two are
  equivalent for this script's tiny, already-flushed writes, but the
  submission contract requires the literal safer pattern (`process.exit()`
  can truncate buffered output before the process exits), and checks for it
  as a literal string in the committed source. This is a real gap in the
  fresh agent's untouched first attempt — reproduced independently in an
  isolated worktree at commit `20a822f...`, not asserted from memory.

This is the one first-attempt gap this trial actually found: contrary to
the exercise's implicit premise, it was the **spec-driven** agent that made
this mistake, not the naive one — the before-attempt agent
(`evidence/before.md`) used `process.exitCode = overallExitCode` correctly
on its own, unprompted. See `evidence/comparison.md`.

## Post-review fixes (not part of the first-attempt experiment)

Two corrections were applied on top of the untouched first attempt above.
Both are recorded here, separately, rather than folded into the
"Implementation commit" field, so that field and the Human hints / Retries
fields above describe only what the fresh agent itself produced.

1. **`process.exit` → `process.exitCode`** (commit
   `2f719be07e54362969a43abf20f8ab22b9c3b111`): fixes the real gap described
   above. After this fix, `npm run test:submission` passes.
2. **Symlink-escape rejection** (commit `20f968187098d5cfcbcc9d3887f3cac45f862c1e`,
   applied in response to PR review): the generator's fixture-directory
   containment check only validated the path text of each check's
   `outputPath`, not its canonical (symlink-resolved) path. A symlink
   placed inside the fixture directory but pointing outside it passed the
   check, and the generator copied and hashed the external file. Fixed by
   also validating the realpath of the artifact against the realpath of
   the fixture directory. See `scripts/test-generate-pr-evidence-cli.mjs`
   for a reproduction and regression check.

The live evidence pack in `evidence/generated/` and `evidence/README.md`
is generated from the current branch tip (`20f968187098d5cfcbcc9d3887f3cac45f862c1e`,
both fixes applied), consistent with the generator's own git-source-binding
check (`verifyGitBinding`), which requires the evidence pack's recorded
source SHA to be the most recent commit touching non-evidence files.

## Real difference from the before attempt

- Files touched: 2 (generator + workflow only) vs. 9 (before also committed
  its own self-test evidence output alongside the implementation, since it
  was not told to separate them).
- Session time: after finished ~25s faster with the spec supplied up front,
  despite writing more thorough per-field rejection messages in its own
  code style.
- No exploratory tool calls were needed to locate the contract fields —
  the after agent's first file write was the generator itself.
- The naive before agent got the `process.exitCode` exit-semantics detail
  right on its own; the spec-driven after agent, despite being told the
  exact CLI contract, got it wrong. Being handed the spec did not
  guarantee correct implementation of every literal requirement in it.

See `evidence/comparison.md` for the full comparison.
