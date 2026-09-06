# Full-Stack Rules Refactor Evidence

Record full Git SHAs, exact backend and client commands, exit codes, contract hashes, save counts, changed paths, and line counts.

## `evidence/before.md` and `evidence/after.md`

Use these exact field names in both files: `Starting commit`, `Run base commit`, `Implementation commit`, `Agent and model`, `Tools and permissions`, `Time limit`, `Human hints: 0`, `Retries: 0`, and `Patch SHA-256`. Also record patch path, Maven tests discovered, backend contract result, client contract result, exception-order differences, JSON differences, rejected-state mutations, save-count differences, files changed, and lines added and removed. Do not treat a zero-test Maven success as contract proof.

For the before run, `Run base commit` is the shared starting commit. For the after run, it is the characterization commit. Generate each patch from its run base to its implementation commit. If both agents produce the same correct source patch, record that ceiling result directly; the controlled run is still evaluated on its pre-committed contract, history, and scope proof.

## `evidence/comparison.md`

Compare lookup order, validation boundary, exception text, HTTP fields, client behavior, state mutation, save counts, and source scope. Support the conclusion with contract hashes, tests, and both patches.

Use the headings `Same conditions`, `Before`, `After`, `Proof`, and `Conclusion`. Generate `commands/rules-verify.txt` with the README's `npm run evidence:capture` command; do not type the exit code manually.

Use genuine Git diffs at `evidence/before.patch` and `evidence/after.patch`; record both paths in the matching Markdown run files.
