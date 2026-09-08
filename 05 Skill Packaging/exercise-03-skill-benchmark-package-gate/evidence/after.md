# Candidate Benchmark

- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Agent: Codex CLI 0.153.4
- Model: gpt-5.6-sol (low reasoning)
- Runtime: `codex exec --ephemeral`
- Tools: shell and file read
- Permissions: read-only
- Time limit: 10 minutes
- Attempt: 1
- Runs: 12 (four evals × three `with_skill` runs)
- Candidate skill tree SHA-256: 215530830a0d6e2404d8f69843e78bd8f720ac96ff935447be18a28369eaa3f2

The frozen candidate passed 100% of training, held-out, and critical assertions with zero held-out variance. Mean overall use was 34,738 tokens and 27.6 seconds. Every output, measured timing/token record, and generated grade is stored under `benchmark-workspace/`.

The generated aggregate selected quality-improvement mode and passed every common and comparison check.
