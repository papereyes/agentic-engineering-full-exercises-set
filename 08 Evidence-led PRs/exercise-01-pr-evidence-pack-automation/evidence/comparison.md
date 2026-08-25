# Comparison: Before vs. After

## Same conditions

Both attempts started from the identical commit
`52090edddf032d026ece16ef90feb627bf8e67ac`, ran as a single first-attempt
Claude Code general-purpose subagent session (`claude-sonnet-5`, full tool
access, no time limit imposed), received zero human hints, and were
committed without correction or retry. Both patches are reproducible with
`git diff --binary --full-index 52090edddf032d026ece16ef90feb627bf8e67ac
<implementation-sha>` and match their recorded SHA-256 digests.

The only variable changed between them is the prompt: the before session
received the bare mission paragraph; the after session received the mission
plus the transcribed field/behavior spec from `docs/evidence-contract.md`,
`docs/evidence-fixtures.md`, `docs/pr-brief.md`, and `docs/action-pins.json`.

## Before

Commit `18441c921ebda8c9a1b96fe88b0da2022c1a3ad0`. The agent explored the
exercise directory unprompted, read the same contract docs itself, and
built a generator and workflow that pass the full protected verifier.
9 files changed (+402/-0) — implementation and its own self-test evidence
output were committed together, since it was never told to separate them.

## After

Fresh-agent commit `20a822f09654d1bfd5d618db4b19f12125920720`, built
directly against the spec supplied in the prompt with no need to explore
for the contract fields first. One review fix was applied on top before
finalizing evidence — `process.exit(pack.overallExitCode)` became
`process.exitCode = pack.overallExitCode` to satisfy the submission
contract's safer-exit requirement, with no change to exit-code semantics —
committed separately as `2f719be07e54362969a43abf20f8ab22b9c3b111`, which is
the recorded Implementation commit. 2 files changed (+208/-0) —
implementation only, evidence generated separately from this exact SHA in a
follow-up commit, per the exercise's required commit ordering.

## Proof

| Check | Before | After |
|---|---|---|
| `npm run agent:check` | exit 0 | exit 0 |
| `npm run evidence:generate -- --sha <own SHA>` | exit 1 (real failure preserved) | exit 1 (real failure preserved) |
| `npm run evidence:verify` (all 6 protected checks) | PASS | PASS |
| Failed check (`checkout-smoke`) risk/reviewerAction/rollback recorded | Yes | Yes |
| Artifacts copied + SHA-256 hashed | 3/3 | 3/3 |
| Workflow: `pull_request`, read-only permissions, pinned action SHAs, `if: always()` on verify+upload, no `continue-on-error` | Yes (`verifyWorkflow` → `[]`) | Yes (`verifyWorkflow` → `[]`) |
| Implementation/evidence commits separated per README step 7 | No | Yes |
| Session elapsed time | 284.8s | 259.7s |

Full raw output: `evidence/commands/agent-check.txt`,
`evidence/commands/evidence-generate.txt`,
`evidence/commands/evidence-verify.txt`. Both patches: `evidence/before.patch`
(SHA-256 `8fa4b37536e401399a5c39404ee8056a9e04e737ecc38a7d67b3b5c347825d98`),
`evidence/after.patch` (SHA-256
`d219ed81774f361f3cb141dea6c42423fab46e2ba258aba4770b4170a7e8d5f0`).

## Conclusion

This trial did not reproduce the exercise's stated premise that "a
success-only report is easy to produce": given only the raw mission, a
capable fresh agent read the same contract docs on its own and built a
correct, verifier-passing solution without being told to. The real,
measured difference is not correctness but process quality — the
spec-driven after session needed no exploratory reading, produced a leaner
diff scoped to exactly the two required deliverables, finished faster, and
followed the required implementation/evidence commit separation because
that instruction was explicit in its prompt rather than left for the agent
to infer. A spec-driven prompt does not just prevent capability failures;
it also removes ambiguity about how the resulting evidence should be
structured for review, which the raw-mission prompt left the agent to guess
at (and it guessed wrong on the commit-separation requirement).
