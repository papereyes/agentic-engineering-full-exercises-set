# TDD cycles

## Cycle 1 — loading

Red: added the loading test as a test-only diff and captured its non-zero result in `tdd-commands.jsonl`.

Green: introduced the smallest loading state in production and captured the passing command in `tdd-commands.jsonl`.

## Cycle 2 — filtered-empty

Red: added distinct filtered-empty behavior and its one-request proof as a test-only diff; the command is in `tdd-commands.jsonl`.

Green: separated the client-side filtered-empty message from server-empty, then captured the passing command in `tdd-commands.jsonl`.

## Cycle 3 — retry

Red: added retry recovery and exact request-count coverage as a test-only diff; the command is in `tdd-commands.jsonl`.

Green: made Retry start a fresh request and captured the passing command in `tdd-commands.jsonl`.

Final review added independent success, server-empty, and request-error tests without expanding production behavior beyond the requested states.
