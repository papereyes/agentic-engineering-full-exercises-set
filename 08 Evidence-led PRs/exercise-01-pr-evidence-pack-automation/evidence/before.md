# Before: Naive First Attempt

- Starting commit: `52090edddf032d026ece16ef90feb627bf8e67ac`
- Implementation commit: `18441c921ebda8c9a1b96fe88b0da2022c1a3ad0`
- Agent and model: Claude Code general-purpose subagent, `claude-sonnet-5`
- Tools and permissions: full tool access (Bash, Read, Write, Edit, Grep, Glob), same permission mode as the orchestrating session
- Time limit: None imposed
- Actual elapsed session time: 284.8s (4m45s)
- Human hints: 0
- Retries: 0
- Prompt: the bare mission text from the exercise README only — no mention of `docs/evidence-contract.md`, `docs/evidence-fixtures.md`, `docs/pr-brief.md`, or `docs/action-pins.json`, and no field-level or workflow-level requirements
- Patch: `evidence/before.patch`
- Patch SHA-256: `8fa4b37536e401399a5c39404ee8056a9e04e737ecc38a7d67b3b5c347825d98`

| Proof | Result |
|---|---|
| Failed checks preserved | 1 out of 1 |
| Commands with exit codes | 3 out of 3 |
| Artifacts copied and hashed | 3 out of 3 |
| Risk, reviewer action, and rollback present | Yes |
| Generator exit code | 1 |
| Files changed | 9 |
| Lines added and removed | +402 / -0 |

## What happened

Given only the raw mission (no docs pointed to, no field spec, no workflow
control list), the agent chose on its own to open the exercise `README.md`,
`docs/evidence-contract.md`, `docs/evidence-fixtures.md`, `docs/pr-brief.md`,
and `docs/action-pins.json` before writing any code, then implemented a
generator and workflow against those contracts.

Re-run in isolation against its own implementation commit
(`18441c921ebda8c9a1b96fe88b0da2022c1a3ad0`, worktree at `/tmp/before-check`):

- `npm run agent:check` → exit 0 (integrity, lint, test, format, typecheck, build all pass)
- `npm run evidence:generate -- --sha 18441c9...` → exit 1 (correctly propagates the fixture's real failure)
- `npm run evidence:verify` → exit 0, all six checks PASS, including the workflow-structure and git-binding checks

The exercise's premise — "a success-only report is easy to produce" — did
not materialize in this trial: this agent did not take that shortcut even
without being told not to.
