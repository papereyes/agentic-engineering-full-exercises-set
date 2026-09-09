# Baseline Benchmark

- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Implementation commit: 640aa91c9168260f654d2c85e1be7484a0513189
- Patch SHA-256: 985e77619dbfa61f3aab5c7322efccf47f158c8652305a287bdd0f34ec557dc5
- Agent: Codex CLI 0.153.4
- Model: gpt-5.6-sol (low reasoning)
- Runtime: `codex exec --ephemeral`
- Tools: shell and file read
- Permissions: read-only
- Time limit: 10 minutes
- Attempt: 1
- Runs: 24 (four evals × three runs × `without_skill` and `starter_skill`)
- Starter skill tree SHA-256: ea51e0bdc9a5663530d36ed0fcd328b5e1a12b2135a970fc7abdc0d359bc2551

The no-skill lane scored 0% training quality and 16.7% held-out quality, with 16.7% held-out critical accuracy and 0.373 held-out variance. Mean overall use was 36,911 tokens and 26.5 seconds. The starter scored 0% training, held-out, and critical quality with zero variance; mean use was 32,981 tokens and 28.0 seconds.

Both training lanes omitted required source citations and exact output headings. Those grading failures do not by themselves prove factual loss: for example, `eval-1/starter_skill/run-1` correctly keeps recovery at 09:24 and the alerting follow-up proposed, while `eval-2/starter_skill/run-1` preserves both unresolved cause hypotheses and the open follow-up. The retained outputs support a citation-and-format compliance gap; this evidence does not make a blanket claim that baseline facts were lost. All outputs, timing records, token counts, and generated grades are under `benchmark-workspace/`.
