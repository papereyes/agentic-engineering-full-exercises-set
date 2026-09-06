# Session Waste Evidence

Use full Git SHAs, exact session conditions, event IDs, commands, exit codes, token or byte counts, and analyzer-generated metrics.

## `evidence/before.md` and `evidence/after.md`

Use these exact field names in both files: `Starting commit`, `Implementation commit`, `Agent and model`, `Tools and permissions`, `Time limit`, `Human hints: 0`, `Retries: 0`, and `Patch SHA-256`. Also record raw event file and hash, patch path, duplicate reads, unchanged failed-command retries, oversized context loads, total preventable calls, final verification position and result, files changed, and lines added and removed.

State that POLICY-217 is a constructed replay. Each replay event needs a unique `eventId`, the replay `sessionId`, and an ISO `capturedAt` timestamp. The simulated agent and model values come from `session-metadata.json`; do not describe them as the tool that created your implementation patch.

## `evidence/comparison.md`

Confirm matching replay conditions. Compare each preventable category, total calls, context bytes, correctness, and final verification timing. Cite raw event IDs and both patches.

Use the headings `Same conditions`, `Before`, `After`, `Proof`, and `Conclusion`. Generate `commands/retro-verify.txt` with the README's `npm run evidence:capture` command; do not type the exit code manually.

Use genuine Git diffs at `evidence/before.patch` and `evidence/after.patch`; record both paths in the matching Markdown run files.
