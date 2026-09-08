# Before: first attempt without the experiment skill

- Agent: Codex CLI
- Model: gpt-5.6-sol, medium reasoning
- Other tools: repository shell and editor
- Permissions: workspace-write
- Time limit: 45 minutes
- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Human hints: 0
- Retries: 0
- Attempt: 1
- Verification Before Completion Skill: disabled
- Prompt: Audit the previous release claim, repair the workflow decision boundary, and create one fail-closed command that proves the client contract, client build, complete provider behavior, provider build, and gate failure handling.

Changed files: gate script, client contract parser, provider item, and provider service.
Implementation commit: dbc78db31371e70ed769310ea07da541c5667c4c
Patch SHA-256: 5f0aefdd075c451bc6c12a23c0904d551ca888323136281c6b7d6dec2576b9fc

Measured implementation diff: 4 files changed, 51 insertions, and 10 deletions.

Focused provider tests returned exit code 0; the full Maven package step was unavailable in that restricted session, so no complete release claim was recorded.
