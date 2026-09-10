# Before: full-context first attempt

- Starting commit: `e134b7e7b3163db395144bfb163a06d24ad06507`
- Implementation commit: `752a5c5247c9ba3785b046f1b4f14fcc3457c068`
- Agent and model: Codex CLI, `gpt-5.6-sol`, medium reasoning
- Tools and permissions: fresh ephemeral session, workspace-write sandbox, shell and repository tools
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Context source: all six protected catalog sources supplied verbatim
- Patch: `evidence/before.patch`
- Patch SHA-256: `92b285d4d62b05866f96d9c5de4188e4c120685ca0c14f489c4a9fd1f5b2ce29`

| Metric | Result |
|---|---|
| Sources loaded | 6: repository rules, both current contracts, legacy notes, UI guide, audit retention |
| Total UTF-8 bytes | 2885 |
| Mandatory sources missed | 0 |
| Stale or irrelevant sources loaded | 3 |
| Adapter checks | Pass; exit code 0 |
| Files changed | 2 |
| Lines added and removed | +109 / -10 |
