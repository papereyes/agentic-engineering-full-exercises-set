# Comparison

This was a fair comparison: same starting commit, prompt, agent, model, other tools, permissions, time limit, and first attempt. Only Playwright MCP evidence changed.

The repository-only attempt improved the locator and waiting strategy but spread coverage across more code. The MCP-informed result used observable readiness, verified the network payloads, made isolation explicit with a unique server session, and covered approval, decline, retry, and duplicate submission in one changed file.

Files changed: before changed the checkout specification with a larger rewrite; after changed only `tests/e2e/flaky-checkout.spec.ts`. The after result is smaller and its coverage is backed by a 20-repeat parallel verification.
