# Completed ESC-120 Lane

Base SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`.
Lane commit: `93d105ec8aad54d52bec97f1d825cca6f9c76f72`.

Owned paths were `src/utils/scoring.ts`, `src/components/SeverityBadge.tsx`, and `tests/esc-120/`. Changed paths matched those prefixes exactly: both source files and `tests/esc-120/inherited.test.tsx`.

The feature command `npm run feature:verify` passed three tests. Reviewer decision: risk-owner accepted the exact commit after confirming its single parent, owned-path scope, regression test, and focused output.

Merge commit: `072944ae351720e9a8636ce6af493b3e71f736c7`, created with `--no-ff`. Rollback: `git revert 072944ae351720e9a8636ce6af493b3e71f736c7`.

Remaining risk: ESC-122 is deliberately unimplemented and remains blocked until `RULE-ESC-122` is approved.
