# After: first attempt with TDD

- Agent: Codex CLI
- Model: gpt-5.6-sol, medium reasoning
- Other tools: repository shell and editor
- Permissions: workspace-write
- Time limit: 45 minutes
- Prompt: Repair the case dashboard test-first. Prove loading, success, server-empty, filtered-empty, request error, and retry recovery through GET /api/cases. Make the network test boundary strict and isolated.
- Attempt: 1
- TDD skill: enabled

Implementation commit: 8eeb3009f5adb5328bf5592e66eb212a4211853f.
Changed files: `src/App.tsx`, `src/test/setup.ts`, and `src/App.network.test.tsx`.

Verification commands:

- `npm run test:smoke`
- `npm run test:acceptance`
- `npm run test:network`
- `npm run test:tdd`
- `npm run agent:check`

The shuffled network suite passed 12 tests for each configured seed.
