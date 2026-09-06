# Repository Rule Hardening Evidence

Use full Git SHAs, exact session conditions, patch hashes, correction-event IDs, commands, and exit codes. Do not edit either agent patch.

## `evidence/before.md` and `evidence/after.md`

Use these exact field names in both files: `Starting commit`, `Run base commit`, `Implementation commit`, `Agent and model`, `Tools and permissions`, `Time limit`, `Human hints: 0`, `Retries: 0`, and `Patch SHA-256`. The before run base is the starting commit. The after run base is the guidance-only commit, and its implementation commit contains only the graded source patch. Also record exact task hash, patch path, detected defect IDs, grader mode, grader exit code, files changed, and lines added and removed.

In both run metadata files, set `promptHash` to `sha256:` followed by the SHA-256 of the supplied proving task after normalizing line endings to LF. The verifier recomputes this value from `tasks/proving-change.md`; copying the same invented value into both files does not pass.

Record `defect-improvement` when the baseline has defects. Record `ceiling-no-regression` when both genuine first attempts are already correct. Identical patches are valid only in the ceiling case.

## `comparison.md`

Confirm both runs differ only by guidance. Compare stable identity, status normalization, clock injection, exception handling, defect count, scope, and checks. Map every improvement to an exact guidance line and correction-event IDs.

Use the headings `Same conditions`, `Before`, `After`, `Proof`, and `Conclusion`. Generate `commands/rules-verify.txt` with the README's `npm run evidence:capture` command; do not type the exit code manually.

The required final path is `evidence/comparison.md`. Keep the genuine agent diffs at `evidence/before.patch` and `evidence/after.patch` and record both paths in the matching run files.
