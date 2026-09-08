# TDD cycles

## Cycle 1 — loading

Red: added strict MSW setup/cleanup and the loading test as a test-only diff before changing `App.tsx`. `tdd-commands.jsonl` record 1 binds that tree to `fb543b73...` and exit code 1.

Green: introduced the loading state in `App.tsx`. JSONL record 2 binds that tree to `af7cb555...` and exit code 0.

## Cycle 2 — filtered-empty

Red: added success, server-empty, and filtered-empty tests as a test-only diff before the filtered-empty production message. `tdd-commands.jsonl` record 3 binds that tree to `e62cd055...` and exit code 1.

Green: separated the client-side filtered-empty message from server-empty. JSONL record 4 binds that tree to `f988492e...` and exit code 0.

## Cycle 3 — retry

Red: added request-error and retry recovery tests as a test-only diff before wiring Retry to `loadCases`. `tdd-commands.jsonl` record 5 binds that tree to `767e0b6a...` and exit code 1.

Green: made Retry start a fresh request. JSONL record 6 binds that tree to `8f85ec05...` and exit code 0.

## Capture limitation

All six original JSONL records have empty `stdout` and `stderr`. Their hashes and exit codes prove ordering and outcomes, but not why each red command failed. The original records remain unchanged. `tdd-review-rerun.md` documents the recovered test-only/production edit boundaries and separately labelled mutation reruns that validate the current tests' failure reasons; those reruns are not substituted for the original cycle history.

Final review confirmed independent success, server-empty, and request-error coverage without expanding production behavior beyond the requested states.
