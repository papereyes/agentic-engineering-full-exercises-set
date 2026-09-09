# Completed ESC-120 Lane

## Git chronology

- Base SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`.
- Lane commit: `93d105ec8aad54d52bec97f1d825cca6f9c76f72`, whose sole parent is the base.
- Merge commit: `072944ae351720e9a8636ce6af493b3e71f736c7`, with parents base then lane, proving a no-ff merge.
- Control commit: `69b6dbb9b25b5198a4e21d9e01fac12539bd2b14`, whose sole parent is the merge.
- Earlier evidence commit: `86f7291569f1a2ec280a17fe20e2a05044211a93`.

This chronology comes from Git objects. No unavailable historical terminal transcript is reconstructed.

## Ownership and review

Owned paths were `src/utils/scoring.ts`, `src/components/SeverityBadge.tsx`, and `tests/esc-120/`. Changed paths matched those prefixes exactly: `src/components/SeverityBadge.tsx`, `src/utils/scoring.ts`, and `tests/esc-120/inherited.test.tsx`.

Reviewer decision: risk-owner accepts the exact lane commit after its single parent, owned paths, changed paths, regression test, and current focused verification were checked.

## Verification

Feature command: `npm run feature:verify`. A present-day detached-worktree rerun at the exact lane commit passed 2 test files and 3 tests with exit code 0. Its complete output is `evidence/commands/esc-120.txt`, SHA-256 `fddc7e7dcb7cab1fe0b09d3a25544a77ce5e4060ac291b9e3ff29d04ac0f75fb`.

Rerun chronology: the sandboxed attempt exited 1 at child `git rev-parse`; the permitted retry exited 1 because the detached worktree lacked dependencies; reusing the integration worktree's existing `node_modules` made the unchanged command pass. These retries describe evidence capture only, not the original lane session.

## Rollback and remaining risk

Rollback: `git revert 072944ae351720e9a8636ce6af493b3e71f736c7`. Revert the later control/evidence commits first if rolling the branch back in order.

Remaining risk: ESC-122 is deliberately unimplemented and remains blocked until `RULE-ESC-122` is approved. The original lane command log was not retained; the exact-SHA rerun is the available proof.
