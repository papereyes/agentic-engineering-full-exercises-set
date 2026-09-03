# Before: repository-only first attempt

- Agent: Codex CLI
- Model: gpt-5.6-sol, medium reasoning
- Other tools: repository shell and editor
- Permissions: workspace-write
- Time limit: 45 minutes
- Prompt: Replace the flaky checkout coverage with an independent test gate for approval, decline recovery, retry, and duplicate-submit protection. Verify the tax and authorization payloads without changing application behaviour.
- Attempt: 1
- Context source: repository inspection
- Playwright MCP: disabled

Implementation commit: 588171fc51ea4454bfa7b05def0acff86b550bf94.
The first attempt replaced the seed with a broad checkout specification, but it was written without live browser/network evidence.
