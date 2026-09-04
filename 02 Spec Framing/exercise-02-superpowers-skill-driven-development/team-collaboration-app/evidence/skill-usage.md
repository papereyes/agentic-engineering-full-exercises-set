# Superpowers Skill Usage

- Superpowers version or commit: https://github.com/obra/superpowers at immutable commit b36e0829c6d0140e93cfef2ca599b1b07d4a7797
- Design artifact: `docs/superpowers/specs/2026-09-04-team-invitations-design.md`
- Plan artifact: `docs/superpowers/plans/2026-09-04-team-invitations.md`
- Design approval: The complete Team Invitations lifecycle design was explicitly approved before the design artifact was committed and before planning or production changes began.

## Skills in chronological order

1. `superpowers:brainstorming` inspected the repository and feature risks, produced the lifecycle design, and obtained approval.
2. `superpowers:writing-plans` converted the approved design into three executable tasks with files, interfaces, tests, and verification commands.
3. `superpowers:subagent-driven-development` selected fresh isolated CLI workers for Tasks 1, 2, and 3, with separate review sessions for implementation tasks and a final whole-branch review.
4. `superpowers:test-driven-development` governed Task 1; its archived session contains the original Red and Green output reproduced in `evidence/tdd.md`. It also governed the post-review acceptance-normalization regression.
5. `superpowers:requesting-code-review` produced independent Task 1 and Task 2 reviews and the broad final review whose findings are resolved in `evidence/review.md`.
6. `superpowers:verification-before-completion` required command evidence before completion claims. The controller retains the final full `npm run verify:exercise` transcript.

## Fresh isolated session proof

Each row is corroborated by the archived JSONL session log and the retained scratch/report artifact.

| Stage | Thread ID | Archived session log | Retained artifact |
|---|---|---|---|
| Task 1 worker | `01a06b0b-2497-7d82-b101-498dbc4a931c` | `/home/papereyes/.codex/sessions/2026/09/04/rollout-2026-09-04T11-41-27-01a06b0b-2497-7d82-b101-498dbc4a931c.jsonl` | `/tmp/exercise-02-02-task1-worker.md` |
| Task 1 reviewer | `01a06b10-4d4d-7fa1-b44c-68149c93d9c3` | `/home/papereyes/.codex/sessions/2026/09/04/rollout-2026-09-04T11-47-05-01a06b10-4d4d-7fa1-b44c-68149c93d9c3.jsonl` | `/tmp/exercise-02-02-task1-review.md` |
| Task 2 worker | `01a06b11-3d98-7903-8301-f5a5e0fe4bd9` | `/home/papereyes/.codex/sessions/2026/09/04/rollout-2026-09-04T11-48-07-01a06b11-3d98-7903-8301-f5a5e0fe4bd9.jsonl` | `/tmp/exercise-02-02-task2-worker.md` |
| Task 2 reviewer | `01a06b14-f57e-7973-911f-8c50a173b9e0` | `/home/papereyes/.codex/sessions/2026/09/04/rollout-2026-09-04T11-52-10-01a06b14-f57e-7973-911f-8c50a173b9e0.jsonl` | `/tmp/exercise-02-02-task2-review.md` |
| Task 3 evidence worker | `01a06b16-8af8-7f52-b7e8-8c56d27b43f7` | `/home/papereyes/.codex/sessions/2026/09/04/rollout-2026-09-04T11-53-54-01a06b16-8af8-7f52-b7e8-8c56d27b43f7.jsonl` | `/tmp/exercise-02-02-task3-worker.md` |
| Final whole-branch reviewer | `01a06b19-e78e-7e90-94c6-44ca67e5ca6c` | `/home/papereyes/.codex/sessions/2026/09/04/rollout-2026-09-04T11-57-34-01a06b19-e78e-7e90-94c6-44ca67e5ca6c.jsonl` | `/tmp/exercise-02-02-final-independent-review.md` |
| Scoped final re-review | `01a06b3c-86a0-7442-9ef0-4e15bd5226b2` | `/home/papereyes/.codex/sessions/2026/09/04/rollout-2026-09-04T12-35-23-01a06b3c-86a0-7442-9ef0-4e15bd5226b2.jsonl` | `/tmp/exercise-02-02-final-rereview-verified.md` |

The Task 2 worker authored and verified the two UI files but could not write the linked-worktree Git index; the controller created commit `41ee7c5748139dfdad95e4782cb3627e6bcf3aca` from those unchanged worker edits. This is recorded as coordination, not as a second implementation attempt.
