# After

## Same conditions

Shared starting/base commit: `e83928ed3c4d34fd51039c65b3d86373687cb259`. Lane commit: `93d105ec8aad54d52bec97f1d825cca6f9c76f72`. No-ff merge commit: `072944ae351720e9a8636ce6af493b3e71f736c7`. Control implementation commit: `69b6dbb9b25b5198a4e21d9e01fac12539bd2b14`.

The immutable Git history does not record the original agent/model, time limit, hints, retries, or raw command transcript, so none is inferred. The proof below is a present-day exact-SHA rerun with zero hints. Its environment retries are recorded separately from implementation history.

## Before

At the base, three unready or terminal cards held unsafe reservations, ESC-120 and ESC-122 collided on scoring, and inherited Critical severity rendered as declared Low.

## After

ESC-120 is merged and all reservations are released. ESC-118 remains `needs-info`; ESC-122 remains blocked only by `RULE-ESC-122`; ESC-121 remains cancelled. The two JSON board mirrors are identical. Inherited Critical severity now drives both scoring and the rendered badge.

Across the scoped product and five control files, 8 files changed with 75 insertions and 43 deletions.

## Proof

Exact after-patch command:

```text
git diff --binary --full-index e83928ed3c4d34fd51039c65b3d86373687cb259 69b6dbb9b25b5198a4e21d9e01fac12539bd2b14 -- <scoring.ts> <SeverityBadge.tsx> <tests/esc-120/> <four docs control files> <application board mirror>
```

The full eight-path output is [after.patch](./after.patch), SHA-256 `bc624308738b29426d0a14d13dad1fb28f87f87e778c0bddc24fd52751b50955`.

Exact-SHA command evidence:

- `npm run feature:verify` at `93d105ec8aad54d52bec97f1d825cca6f9c76f72`: PASS, exit 0, 2 files and 3 tests; [raw output](./commands/esc-120.txt).
- `npm run board:verify` at `69b6dbb9b25b5198a4e21d9e01fac12539bd2b14`: PASS, exit 0; [raw output](./commands/board.txt).
- `npm run verify:exercise` on pre-hardening branch SHA `86f7291569f1a2ec280a17fe20e2a05044211a93`: PASS, exit 0; [raw output](./commands/verify-exercise.txt).

Evidence-capture chronology: the first direct lane and board attempts each exited 1 because the sandbox denied their child `git rev-parse`; both were retried with command permission. Board then passed. Lane reached Git but exited 1 because the detached worktree had no `node_modules`; it was pointed at the integration worktree's existing dependency tree and the unchanged command then passed. These are rerun-environment retries, not claims about the original lane history.

## Conclusion

Git binds the accepted lane, no-ff merge, and control reconciliation; current exact-SHA reruns prove the feature and board states. Original historical command logs were not retained, so the reruns are labelled as reruns.
