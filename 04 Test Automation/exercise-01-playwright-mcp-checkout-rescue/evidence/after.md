# After: MCP-informed first attempt

- Agent: Codex CLI
- Model: gpt-5.6-sol, medium reasoning
- Other tools: repository shell and editor
- Permissions: workspace-write
- Time limit: 45 minutes
- Prompt: Replace the flaky checkout coverage with an independent test gate for approval, decline recovery, retry, and duplicate-submit protection. Verify the tax and authorization payloads without changing application behaviour.
- Attempt: 1
- Context source: live Playwright MCP evidence
- Playwright MCP: enabled

Implementation commit: 6cd2ccc8a18c5293b8e87aab3208df8c4aa28225.
Changed files: one end-to-end specification; application behaviour was unchanged.

Verification commands:

- `npm run test:smoke`
- `npm run test:e2e:reproduce`
- `npm run test:checkout`
- `npm run agent:check`

The focused suite passed 3 tests, and the required repeated parallel run passed 60 tests.
