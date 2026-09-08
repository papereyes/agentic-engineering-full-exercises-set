# After: first attempt with TDD

- Agent: Codex CLI
- Model: gpt-5.6-sol, medium reasoning
- Other tools: repository shell and editor
- Permissions: workspace-write
- Time limit: 45 minutes
- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Human hints: 0
- Retries: 0
- Prompt: Repair the case dashboard test-first. Prove loading, success, server-empty, filtered-empty, request error, and retry recovery through GET /api/cases. Make the network test boundary strict and isolated.
- Attempt: 1
- TDD skill: enabled

Implementation commit: 8eeb3009f5adb5328bf5592e66eb212a4211853f
Patch SHA-256: dc5e037766951ca1faa0560389d6252b6de8f88d7b3665a03d9cb3fe4314728a

Measured implementation diff: 3 files changed, 92 insertions, and 7 deletions.

Changed files: `src/App.tsx`, `src/test/setup.ts`, and `src/App.network.test.tsx`.

Verification commands:

- `npm run test:smoke`
- `npm run test:acceptance`
- `npm run test:network`
- `npm run test:tdd`
- `npm run agent:check`

The shuffled network suite passed 12 tests for each configured seed.

The original JSONL captured ordering, hashes, timings, commands, and exit codes but no process output. That limitation is now explicit in `tdd-cycles.md`; `tdd-review-rerun.md` records separately labelled review-time mutation checks and does not reconstruct the original history.

The complete fresh `npm run verify:exercise` transcript is in `final-verification.txt`. It exited 0, including the outer clean-state wrapper. The owner's earlier `ENOBUFS` result was a wrapper-process failure while the nested core verifier passed; it is not represented as a product-test failure or as a successful wrapper run.
