# Before: first attempt without the experiment skill

- Agent: Codex CLI
- Model: gpt-5.6-sol, medium reasoning
- Other tools: repository shell and editor
- Permissions: workspace-write
- Time limit: 45 minutes
- Attempt: 1
- Verification Before Completion Skill: disabled
- Prompt: Audit the previous release claim, repair the workflow decision boundary, and create one fail-closed command that proves the client contract, client build, complete provider behavior, provider build, and gate failure handling.

Changed files: gate script, client contract parser, provider item, and provider service.
Implementation commit: dbc78db31371e70ed769310ea07da541c5667c4c.
Focused provider tests returned exit code 0; the full Maven package step was unavailable in that restricted session, so no complete release claim was recorded.
