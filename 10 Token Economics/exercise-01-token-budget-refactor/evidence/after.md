# After: selected-context first attempt

- Starting commit: `e134b7e7b3163db395144bfb163a06d24ad06507`
- Implementation commit: `ef46d735d3bdcbe197040ed9687e22cb6528406b`
- Agent and model: Codex CLI, `gpt-5.6-sol`, medium reasoning
- Tools and permissions: fresh ephemeral session, workspace-write sandbox, shell and repository tools
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Context source: deterministic 2,000-byte plan selecting repository rules and the two current contracts
- Patch: `evidence/after.patch`
- Patch SHA-256: `c2e867854470d2112b5839e76e2346cf5f15a630ceb2574479b20ba20e893484`

| Metric | Result |
|---|---|
| Sources loaded | 3: repository-rules, current-adapter-contract, current-error-contract |
| Total UTF-8 bytes | 1867 |
| Mandatory sources missed | 0 |
| Stale or irrelevant sources loaded | 0 |
| Adapter checks | Pass; exit code 0, including sparse-array regression |
| Files changed | 4 implementation/test paths |
| Lines added and removed | +135 / -10 |
