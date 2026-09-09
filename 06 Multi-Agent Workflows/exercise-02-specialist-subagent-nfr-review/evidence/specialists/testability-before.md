# Testability specialist — before

Reviewed SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`
Session: `testability-before-e83928ed-20260909T074907Z`

TEST-01 (blocker) at `nfr-swarm-app/src/services/accessReviewApi.ts:3`. Reproduction: call approval from the Node test environment; `window` is undefined and no fake wait can be supplied. Impact: the security boundary cannot be tested deterministically without a browser and real delay. Recommendation: use a platform-neutral default and accept an optional wait dependency.
