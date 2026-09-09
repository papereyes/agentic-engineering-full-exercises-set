# Integration Log

- Base SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`.
- Lane commit: `93d105ec8aad54d52bec97f1d825cca6f9c76f72` on `lane/esc-120-inherited-severity`.
- Reviewer: risk-owner accepted the exact lane commit after its owned paths and parent were inspected.
- Feature command: `npm run feature:verify` passed 3 tests at the lane commit.
- Merge commit: `072944ae351720e9a8636ce6af493b3e71f736c7`, created with `--no-ff`.
- Board command: `npm run board:verify` is recorded after this control commit.
- Reservation releases: ESC-118, ESC-120, ESC-121, and ESC-122 now hold no active reservations.
- Remaining blocker: ESC-122 still waits for `RULE-ESC-122`; no rule was invented.
- Decision: accept ESC-120 only and preserve all other card states.
- Rollback: revert the control commit first, then `git revert 072944ae351720e9a8636ce6af493b3e71f736c7`.
