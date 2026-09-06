# Workflow Benchmark Contract

Each lane contains three runs for every protected case. Corresponding runs use the same `agent`, `model`, `settingsHash`, `toolsHash`, `permissionsHash`, `timeLimitMinutes`, and source task. Baseline uses `baselineSha`; candidate uses its one-file `candidateSha`.

Each run records `caseId`, `run`, conditions, `repositorySha`, `workflowSha256`, a unique raw-run `sessionId`, `metricsSource`, ISO `capturedAt`, positive integer `tokens` and `durationMs`, structured `response`, and `responseSha256` over compact JSON serialization of that response. `workflowSha256` is the SHA-256 of the committed workflow normalized to LF with one final newline. Copy token and duration values from the named agent or provider session record. The verifier checks provenance fields and internal consistency; `adoption.md` must state when the provider cannot independently authenticate those measurements.

The scorer derives every assertion from response actions and findings. Passing normally requires candidate train quality at least 0.85, held-out quality at least 0.90, at least 0.10 improvement on both splits, every held-out critical grade passing, held-out run-quality standard deviation at most 0.20, median tokens no more than 1.25 times baseline, and median duration no more than 1.50 times baseline.

If either baseline quality score is already at least 0.95, the scorer uses ceiling-aware mode. Candidate quality and critical results must not regress, and the candidate must improve median tokens or duration by at least 15 percent, or held-out consistency by at least 0.02.

Candidate instructions must remain below 120 lines and 1,800 words and may not contain case IDs, assertion IDs, or distinctive wording copied from a replay request.
