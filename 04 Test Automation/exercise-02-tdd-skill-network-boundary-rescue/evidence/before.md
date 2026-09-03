# Before: first attempt without the TDD input

- Agent: Codex CLI
- Model: gpt-5.6-sol, medium reasoning
- Other tools: repository shell and editor
- Permissions: workspace-write
- Time limit: 45 minutes
- Prompt: Repair the case dashboard test-first. Prove loading, success, server-empty, filtered-empty, request error, and retry recovery through GET /api/cases. Make the network test boundary strict and isolated.
- Attempt: 1
- TDD skill: disabled

Implementation commit: 86a80ab4e61b05cc3208f361a26e1ba5a65b2add.
The result added coverage, but it was not constrained by the installed TDD skill or machine-captured red/green cycles.
