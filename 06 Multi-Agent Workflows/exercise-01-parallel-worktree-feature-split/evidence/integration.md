# Integration Report

Baseline SHA was `e83928ed3c4d34fd51039c65b3d86373687cb259`. The untrusted handoff UNTRUSTED-01 was rejected because its commit-parent, changed-path, and verification-output claims do not match Git or the filesystem.

## Lane review

The integration owner reviewed each exact lane commit and its owned paths. A, B, and C passed their focused commands. Fresh post-integration reruns now record the complete command output from detached worktrees at each exact accepted SHA.

Lane B's recoverable Git chronology shows initial commit `476140c211104941db473467c4a00cd5f9a7a027`, stale integration merge `fdc1e8f504af7556da3cd15def21005495b4a396`, amended accepted commit `1ac6bbdd195cdda94c08b00c5c6e49ac63a6736d`, then accepted merge `f46c3e5d5933a270bfc87a361eb09253ddacef8f`. The amendment kept `dueToday` compatible with loading-state summaries. The original failed-check transcript was not retained and has not been reconstructed.

## Shared requests and merge order

The required merge order was B, A, C, each with `--no-ff`. No textual conflicts occurred. Lane A requested FilterPreset promotion and Lane C requested EvidenceBundle promotion. The shared-type commit `a19966b482a23d9867f7553c404da881a064bfd6` moved both definitions to `src/types.ts` and changed only the three authorized files.

## Final checks and cleanup

The exact-product-head rerun `npm run test:integrated` passed 9 tests across 6 files. Before evidence hardening, `npm run verify:exercise` at snapshot `b152c10a251136d3f9e64a65b00e494dd0e4e5f3` exited 0; `commands/verify-exercise.txt` retains its complete unedited transcript and exit-code footer. Linked lane worktrees were removed after recording the before state; lane branches remain for audit.

The original dependency-install transcript was not retained and is not reconstructed. For reproducibility, the four labelled exact-SHA reruns used detached temporary worktrees whose `node_modules` entries linked to the already-installed dependency tree in the integration worktree; no lockfile changed.

Remaining risk is limited to browser download behavior outside the protected tests. Rollback order is shared-type commit, then C, A, and B merge commits in reverse integration order.
