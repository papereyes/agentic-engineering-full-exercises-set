# Baseline review evidence

## Same conditions

- Repository baseline: `e83928ed3c4d34fd51039c65b3d86373687cb259`
- Remediation compared later: `354692d34864d66324f1af8b9469a3c792f68a9e`
- App directory: `06 Multi-Agent Workflows/exercise-02-specialist-subagent-nfr-review/nfr-swarm-app`
- Commands: `npm run review:security`, `npm run review:accessibility`, `npm run review:performance`, and `npm run review:testability`
- Runtime/dependencies: Node.js 25.9.0 and the same existing dependency installation for both detached worktrees
- Human hints: 0
- Command-capture retries: 1 after the initial sandboxed `spawnSync git EPERM` attempt; this included the performance and testability reruns

## Before

Baseline SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`

The four independent before specialist sessions reported six findings: five blockers and one warning. The raw command files are new integration-owner detached-worktree reruns at the same SHA, not reconstructed transcripts from those sessions. Each authoritative retry exited 1 and reproduced the baseline failures.

## After

The remediation state used for the paired comparison is `354692d34864d66324f1af8b9469a3c792f68a9e`. Its fresh independent after sessions and raw integration-owner reruns are documented in `after.md`.

## Proof

`before.patch` is intentionally a specialized risky-baseline snapshot, not a remediation delta. It contains only the five reviewed risky source files as additions from the Git empty tree.

- Empty tree: `4b825dc642cb6eb9a060e54bf8d69288fbee4904`
- Exact command: `rtk proxy git diff --binary --full-index 4b825dc642cb6eb9a060e54bf8d69288fbee4904 e83928ed3c4d34fd51039c65b3d86373687cb259 -- '06 Multi-Agent Workflows/exercise-02-specialist-subagent-nfr-review/nfr-swarm-app/src/App.tsx' '06 Multi-Agent Workflows/exercise-02-specialist-subagent-nfr-review/nfr-swarm-app/src/components/AccessReviewQueue.tsx' '06 Multi-Agent Workflows/exercise-02-specialist-subagent-nfr-review/nfr-swarm-app/src/components/ReviewNote.tsx' '06 Multi-Agent Workflows/exercise-02-specialist-subagent-nfr-review/nfr-swarm-app/src/services/accessReviewApi.ts' '06 Multi-Agent Workflows/exercise-02-specialist-subagent-nfr-review/nfr-swarm-app/src/utils/accessReviewRisk.ts'`
- Exit code: 0
- Patch SHA-256: `4e2b66e8b91eaf3e35a61c7412b23dca606c1d6f4aef0efa6dff0383367be69e`
- Complete command output: `evidence/commands/*-before.txt`

## Conclusion

The exact baseline reproducibly fails every focused specialist gate and is blocked from merge.
