# Workflow Optimizer Evidence

Use full Git SHAs, exact run settings, response hashes, token counts, durations, generated grades, commands, and exit codes.

## `evidence/before.md` and `evidence/after.md`

Use these exact field names in both files: `Starting commit`, `Implementation commit`, `Agent and model`, `Tools and permissions`, `Time limit`, `Human hints: 0`, `Retries: 0`, and `Patch SHA-256`. Also record workflow hash, settings, case count, runs per case, raw response count, quality score, critical failures, variance, median tokens, median duration, patch path, files changed, and lines added and removed.

Use the protected baseline commit as the before implementation commit and the one-file workflow commit as the after implementation commit. After recording those SHAs in `evidence/history.json`, run `npm run evidence:patches`. It creates a snapshot patch for the unchanged baseline and the exact baseline-to-candidate diff. Do not create or edit either patch manually.

For every raw run, record a unique `sessionId`, a `metricsSource` that names that session, ISO `capturedAt`, tokens, and duration. Copy the values from the agent or provider session record. State in `adoption.md` whether that source independently authenticates the measurements; the local verifier can validate consistency but cannot prove an external provider's billing data.

## `comparison.md`

Confirm conditions differ only by the workflow. Compare training and held-out quality, critical failures, variance, tokens, duration, unsupported completion claims, and workflow size. State the adoption decision from the generated benchmark.

Use the headings `Same conditions`, `Before`, `After`, `Proof`, and `Conclusion`. Generate `commands/workflow-verify.txt` with the README's `npm run evidence:capture` command; do not type the exit code manually.

The required final path is `evidence/comparison.md`. Keep genuine Git diffs at `evidence/before.patch` and `evidence/after.patch` and record both paths in the matching run files.
