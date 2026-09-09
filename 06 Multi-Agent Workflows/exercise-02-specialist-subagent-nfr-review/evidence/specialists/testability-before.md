# Testability specialist — before

Reviewed SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`
Independent specialist session: `testability-before-e83928ed-20260909T074907Z`

TEST-01 (blocker) at `nfr-swarm-app/src/services/accessReviewApi.ts:3`. Reproduction: call approval from the Node test environment; `window` is undefined and no fake wait can be supplied. Impact: the security boundary cannot be tested deterministically without a browser and real delay. Recommendation: use a platform-neutral default and accept an optional wait dependency.

## Review provenance

The finding and recommendation above are the independent specialist's reasoning from the named session. During evidence hardening, the integration owner's initial sandboxed rerun failed before the tests with `spawnSync git EPERM`; the retry outside that subprocess sandbox produced the complete raw failure output in `evidence/commands/testability-before.txt`. That file is a detached-worktree rerun at the same 40-character SHA, not reconstructed historical output from the specialist session.
