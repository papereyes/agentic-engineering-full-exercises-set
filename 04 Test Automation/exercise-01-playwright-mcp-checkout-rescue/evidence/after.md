# After: MCP-informed first attempt

- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Agent: Codex CLI
- Model: gpt-5.6-sol with medium reasoning
- Other tools: repository shell and editor
- Permissions: workspace-write
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Prompt: Replace the flaky checkout coverage with an independent test gate for approval, decline recovery, retry, and duplicate-submit protection. Verify the tax and authorization payloads without changing application behaviour.
- Attempt: 1
- Context source: live Playwright MCP evidence
- Playwright MCP: enabled

Implementation commit: 6cd2ccc8a18c5293b8e87aab3208df8c4aa28225
Patch SHA-256: d65dc65dd4f0d3f8c17a7dcb8732902beba9a505f89e9dcbef5f9329cd1a94ab

Measured implementation diff: 1 file changed, 64 insertions, and 8 deletions. Application behaviour was unchanged.

Verification commands:

- `npm run test:smoke`
- `npm run test:e2e:reproduce`
- `npm run test:checkout`
- `npm run agent:check`

The focused suite passed 3 tests, and the required repeated parallel run passed 60 tests.

## Review follow-up

The original MCP narrative did not preserve a chronological tool transcript. `mcp-investigation.md` therefore retains the original observations separately and labels the 2026-09-08 chronology as a review rerun; it does not present the rerun as first-attempt evidence. The review fix adds the missing complete retry authorization-body assertion.

The owner reported that a default `npm run verify:exercise` run created Playwright report files and exited 1 at the clean-state guard. A fresh-checkout reproduction confirmed that `PLAYWRIGHT_OUTPUT_DIR` does not relocate `test-results/.last-run.json`. The corrected review verification uses the supported `PLAYWRIGHT_HTML_OUTPUT_DIR` and `PLAYWRIGHT_LAST_RUN_OUTPUT_FILE` settings under `/tmp`, leaving protected checks unchanged. See `final-verification.txt` for the complete transcript and exit code.
