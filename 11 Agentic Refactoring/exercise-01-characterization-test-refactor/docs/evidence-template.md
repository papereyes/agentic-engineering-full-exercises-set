# Characterization Refactor Evidence

Record full Git SHAs, exact commands, exit codes, output digests, changed paths, and line counts.

## `evidence/before.md` and `evidence/after.md`

Use these exact field names in both files: `Starting commit`, `Run base commit`, `Implementation commit`, `Agent and model`, `Tools and permissions`, `Time limit`, `Human hints: 0`, `Retries: 0`, and `Patch SHA-256`. Also record patch path, oracle exit code, output SHA-256, changed cases, changed files, and lines added and removed.

Use `evidence/before.patch` for the unconstrained result and `evidence/after.patch` for the characterization-first result.

For the before run, `Run base commit` is the shared starting commit. For the after run, it is the characterization commit. Generate each patch from its run base to its implementation commit so the patches compare the two agent implementations, not the participant-created characterization files.

If both agents produce the same correct source patch, record that result directly. The verifier allows an identical-patch ceiling result because the controlled run is also evaluated on its pre-committed oracle, history, and scope proof.

## `evidence/comparison.md`

Compare public behavior changes, reason-string changes, validation gaps, test seam, source scope, and command results. Support every statement with output hashes, Git commits, and both patches.

Use the headings `Same conditions`, `Before`, `After`, `Proof`, and `Conclusion`. Generate `commands/refactor-verify.txt` with the README's `npm run evidence:capture` command; do not type the exit code manually.
