# Comparison: Before vs. After

## Same conditions

Both attempts started from the identical commit
`52090edddf032d026ece16ef90feb627bf8e67ac`, ran as a single first-attempt
Claude Code general-purpose subagent session (`claude-sonnet-5`, full tool
access, no time limit imposed), received zero human hints during the
session, and the recorded Implementation commit for each is the agent's own
commit with no correction or retry applied to it. Both patches are
reproducible with `git diff --binary --full-index
52090edddf032d026ece16ef90feb627bf8e67ac <implementation-sha>` and match
their recorded SHA-256 digests. (The after branch has two further,
post-review corrections on top of its recorded Implementation commit —
see "After" below and `evidence/after.md` — but those are not part of
either first-attempt experiment.)

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

Fresh-agent commit `20a822f09654d1bfd5d618db4b19f12125920720` (the recorded
Implementation commit), built directly against the spec supplied in the
prompt with no need to explore for the contract fields first. 2 files
changed (+208/-0) — implementation only, evidence generated separately from
this exact SHA in a follow-up commit, per the exercise's required commit
ordering.

This untouched first attempt has one real gap: it wrote
`process.exit(pack.overallExitCode)` instead of the submission contract's
required `process.exitCode = pack.overallExitCode`, so
`npm run test:submission` fails at this commit with `generate-pr-evidence.mjs
is missing required content: process.exitCode` (reproduced independently in
an isolated worktree, not asserted from memory). Two corrections were
applied afterward and are recorded separately in `evidence/after.md`
("Post-review fixes"), not folded into this Implementation commit: the
`process.exitCode` fix (commit `2f719be07e54362969a43abf20f8ab22b9c3b111`),
and a symlink-escape fix in the artifact-containment check found by PR
review (commit `20f968187098d5cfcbcc9d3887f3cac45f862c1e`). The live
evidence pack in `evidence/generated/` is generated from the latter,
current tip commit.

## Proof

| Check | Before (own SHA) | After, untouched first attempt (`20a822f`) |
|---|---|---|
| `npm run agent:check` | exit 0 | exit 0 |
| `npm run evidence:generate -- --sha <own SHA>` | exit 1 (real failure preserved) | exit 1 (real failure preserved) |
| `npm run evidence:verify` (all 6 protected checks) | PASS | PASS |
| `npm run test:submission` | PASS | **FAIL** — missing literal `process.exitCode` in source |
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
`90b42400395cd97ca498256f8729d8adaf02dd3b6315a5d64bde68e963b29a6e`).

## Conclusion

This trial partially reproduced the exercise's stated premise, but in the
opposite direction from what "spec-driven beats naive" would predict: given
only the raw mission, the naive before agent read the same contract docs on
its own and correctly used `process.exitCode = overallExitCode`. The
spec-driven after agent, despite being handed the exact CLI contract up
front — including the literal requirement — wrote `process.exit(...)`
instead and failed one submission-contract check in its untouched first
attempt. Being given the spec did not guarantee the agent implemented every
literal requirement in it correctly; the naive agent's own judgment (a
general best-practice reflex, not spec-following) happened to get this
specific detail right. Beyond that one gap, both attempts independently
built correct, verifier-passing generators and workflows without being told
the contract docs existed. Process quality still differed: the spec-driven
after session needed no exploratory reading, produced a leaner diff scoped
to exactly the two required deliverables, finished faster, and followed the
required implementation/evidence commit separation because that instruction
was explicit in its prompt rather than left for the agent to infer.
