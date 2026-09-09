# Performance specialist — before

Reviewed SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`
Session: `perf-before-e83928ed-20260909-a7f3`

PERF-01 (blocker) at `nfr-swarm-app/src/utils/accessReviewRisk.ts:5`. Reproduction and measurement: the protected 200-item, five-iteration benchmark repeats a full reduction 150,000 times per call. Impact: synchronous work blocks rendering. Recommendation: calculate it in one logical pass.

PERF-02 (warning) at `nfr-swarm-app/src/App.tsx:14`. Reproduction: change only selection or error state. Impact: unchanged review collections are recalculated on unrelated renders. Recommendation: memoize the calculation by `reviews`.
