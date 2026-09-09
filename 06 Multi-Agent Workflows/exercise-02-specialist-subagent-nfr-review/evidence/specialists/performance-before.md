# Performance specialist — before

Reviewed SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`
Independent specialist session: `perf-before-e83928ed-20260909-a7f3`

PERF-01 (blocker) at `nfr-swarm-app/src/utils/accessReviewRisk.ts:5`. Reproduction and measurement: the protected 200-item, five-iteration benchmark repeats a full reduction 150,000 times per call. Impact: synchronous work blocks rendering. Recommendation: calculate it in one logical pass.

PERF-02 (warning) at `nfr-swarm-app/src/App.tsx:14`. Reproduction: change only selection or error state. Impact: unchanged review collections are recalculated on unrelated renders. Recommendation: memoize the calculation by `reviews`.

## Review provenance

The findings and recommendations above are the independent specialist's reasoning from the named session. During evidence hardening, the integration owner's initial sandboxed rerun failed before the tests with `spawnSync git EPERM`; the retry outside that subprocess sandbox produced the complete raw failure output in `evidence/commands/performance-before.txt`. That file is a detached-worktree rerun at the same 40-character SHA, not reconstructed historical output from the specialist session.
