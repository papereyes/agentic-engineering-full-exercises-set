# Integration Report

Baseline SHA was `e83928ed3c4d34fd51039c65b3d86373687cb259`. The untrusted handoff UNTRUSTED-01 was rejected because its commit-parent, changed-path, and verification-output claims do not match Git or the filesystem.

## Lane review

The integration owner reviewed each exact lane commit and its owned paths. A, B, and C passed their focused commands. Lane B was amended before integration after a full typecheck exposed the loading-state summary; the accepted commit keeps the compatibility fix inside its owned MetricStrip path.

## Shared requests and merge order

The required merge order was B, A, C, each with `--no-ff`. No textual conflicts occurred. Lane A requested FilterPreset promotion and Lane C requested EvidenceBundle promotion. The shared-type commit `a19966b482a23d9867f7553c404da881a064bfd6` moved both definitions to `src/types.ts` and changed only the three authorized files.

## Final checks and cleanup

The final check `npm run test:integrated` passed 9 tests across 6 files, and typecheck passed. Linked lane worktrees were removed after recording the before state; lane branches remain for audit.

Remaining risk is limited to browser download behavior outside the protected tests. Rollback order is shared-type commit, then C, A, and B merge commits in reverse integration order.
