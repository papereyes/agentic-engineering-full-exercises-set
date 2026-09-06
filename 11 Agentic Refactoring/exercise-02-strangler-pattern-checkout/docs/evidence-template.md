# Checkout Strangler Evidence

Record full Git SHAs, exact commands, exit codes, route call counts, changed paths, and line counts.

## `evidence/before.md` and `evidence/after.md`

Use these exact field names in both files: `Starting commit`, `Run base commit`, `Implementation commit`, `Agent and model`, `Tools and permissions`, `Time limit`, `Human hints: 0`, `Retries: 0`, and `Patch SHA-256`. Also record patch path, checkout check exit code, public-contract differences, new-slice calls, legacy calls, duplicate-authorization risk, files changed, and lines added and removed.

For the before run, `Run base commit` is the shared starting commit. For the after run, it is the participant-test commit. Generate each patch from its run base to its implementation commit so `after.patch` contains only the fresh agent's router and card-slice work.

## `evidence/comparison.md`

Compare card, gift-card, invoice, unknown, flag-off, safe-fallback, and unsafe-fallback routes. Cite exact tests, call counts, and both patches.

Use the headings `Same conditions`, `Before`, `After`, `Proof`, and `Conclusion`. Generate `commands/strangler-verify.txt` with the README's `npm run evidence:capture` command; do not type the exit code manually.

Use genuine Git diffs at `evidence/before.patch` and `evidence/after.patch`; record both paths in the matching Markdown run files.

If both agents produce the same correct source patch, record that ceiling result directly. The controlled run is still evaluated on its explicit fallback contract, route matrix, and scope proof.
