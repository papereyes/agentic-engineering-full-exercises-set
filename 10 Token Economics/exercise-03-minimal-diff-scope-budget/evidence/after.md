# After: pre-scoped first attempt

- Starting commit: `e134b7e7b3163db395144bfb163a06d24ad06507`
- Implementation commit: `6a8d21e82609e71729b5a7d2a5d75d6ce6780635`
- Agent and model: Codex CLI, `gpt-5.6-sol`, medium reasoning
- Tools and permissions: fresh ephemeral session, workspace-write sandbox, shell and repository tools
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/after.patch`
- Patch SHA-256: `2cf7346a8b6a5695a3a327ca4279ff4e2a63703579a7f4d7695cb667c744eb45`

Actual scope was exactly the two allowed source paths and 18 changed lines. Export returns `ds-secondary`; checkout and unknown actions return `legacy-primary`; delete returns `legacy-danger`. Focused migration tests, typecheck, and formatting passed with exit code 0.
