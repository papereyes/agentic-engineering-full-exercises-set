# Before Trigger Evaluation

- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Implementation commit: 20465b20de7333e57e9aa2ec056780fa3122fcaa
- Patch SHA-256: 6634fccf1f3c93bab0905f5e818923ea258e3217fd201c0e5783dbba47f77ef1
- Provider: OpenAI
- Agent: Codex CLI 0.153.4
- Model: gpt-5.6-sol (low reasoning)
- Runtime: `codex exec --ephemeral` target-only router
- Settings: temperature at runtime default; read-only permissions
- Description SHA-256: 6686763b22f80693bcf05f97cb63867534514aaebc1e1d950ba8cf96f435ab3c
- Decisions: 60 (20 protected requests × 3 first-attempt runs)
- Result: `evidence/before-results.json`

Only the `change-review` name and original description plus the exact unlabeled prompts were supplied. Each raw response, selected-skill list, UTC timestamp, observation, and response SHA-256 is preserved in the result file.

Scoring: training 12/12; held-out 7/8; held-out precision 0.80, recall 1.00, specificity 0.75; unanimous rate 1.00. The held-out compound request was the sole false positive.
