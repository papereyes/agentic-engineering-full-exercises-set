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
- Decisions: 60 (20 protected requests × 3 independent first-attempt sessions)
- Result: `evidence/before-results.json`

Each `codex exec --ephemeral` process received only the `change-review` name, original description, and one exact unlabeled request. Runs executed concurrently with read-only permissions between `2026-09-09T10:46:59.887Z` and `2026-09-09T10:49:39.825Z`; concurrency did not share model context. All 60 distinct thread IDs, start/completion timestamps, exit codes, and response paths are retained in `evidence/routing-run-log.json`. Complete unedited final JSON responses live under `evidence/routing-responses/before/`; `raw_response`, `selected_skills`, file path, thread ID, and SHA-256 are bound together in the result file.

Scoring: training 9/12; held-out 4/8; held-out precision 0.50, recall 1.00, specificity 0.00; overall unanimous rate 0.95. Training false positives were `train-release`, `train-pr-summary`, and `train-review-advice`; all four held-out negative cases were false positives.
