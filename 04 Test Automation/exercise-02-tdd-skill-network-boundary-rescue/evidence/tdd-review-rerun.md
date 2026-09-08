# Review-time TDD mutation rerun

Date: 2026-09-08
Implementation commit: `8eeb3009f5adb5328bf5592e66eb212a4211853f`

## Scope

The original `tdd-commands.jsonl` is hash-sealed and remains unchanged. Its empty `stdout` and `stderr` fields mean the original failure reasons are unavailable. The archived edit history still identifies each test-only tree and its subsequent production change, as mapped in `tdd-cycles.md`.

The checks below are new, separately labelled mutation reruns against the implementation commit. They show that the current focused tests detect the intended defects. They are not reconstructed first-attempt output.

## Cycle 1 behavior — loading

Mutation: remove the loading status from `App.tsx`.

Command: `npm run test:component -- src/App.network.test.tsx -t 'announces loading'`

Relevant unedited red output:

```text
FAIL  src/App.network.test.tsx > case dashboard network states > announces loading while GET /api/cases is pending
TestingLibraryElementError: Unable to find an accessible element with the role "status"
Test Files  1 failed (1)
Tests  1 failed | 5 skipped (6)
```

Exit code: 1.

After restoring the loading status, the same command returned:

```text
✓ src/App.network.test.tsx (6 tests | 5 skipped)
Test Files  1 passed (1)
Tests  1 passed | 5 skipped (6)
```

Exit code: 0.

## Cycle 2 behavior — filtered-empty

Mutation: replace the filtered-empty message with the server-empty message.

Command: `npm run test:component -- src/App.network.test.tsx -t 'shows filtered-empty'`

Relevant unedited red output:

```text
FAIL  src/App.network.test.tsx > case dashboard network states > shows filtered-empty without another GET /api/cases request
TestingLibraryElementError: Unable to find an element with the text: No cases match "unknown customer".
Test Files  1 failed (1)
Tests  1 failed | 5 skipped (6)
```

Exit code: 1.

After restoring the distinct filtered-empty message, the same command returned:

```text
✓ src/App.network.test.tsx (6 tests | 5 skipped) 236ms
Test Files  1 passed (1)
Tests  1 passed | 5 skipped (6)
```

Exit code: 0.

## Cycle 3 behavior — retry

Mutation: make Retry clear the error instead of calling `loadCases`.

Command: `npm run test:component -- src/App.network.test.tsx -t 'sends one retry request'`

Relevant unedited red output:

```text
FAIL  src/App.network.test.tsx > case dashboard network states > sends one retry request and recovers
TestingLibraryElementError: Unable to find an element with the text: Recovered Co.
Test Files  1 failed (1)
Tests  1 failed | 5 skipped (6)
```

Exit code: 1.

After restoring Retry to call `loadCases`, the same command returned:

```text
✓ src/App.network.test.tsx (6 tests | 5 skipped) 288ms
Test Files  1 passed (1)
Tests  1 passed | 5 skipped (6)
```

Exit code: 0.
