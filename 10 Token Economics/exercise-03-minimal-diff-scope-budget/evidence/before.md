# Before: unconstrained first attempt

- Starting commit: `e134b7e7b3163db395144bfb163a06d24ad06507`
- Implementation commit: `693373b6df82c2c1b3b65d6fbfe1536cbb1116d6`
- Agent and model: Codex CLI, `gpt-5.6-sol`, medium reasoning
- Tools and permissions: fresh ephemeral session, workspace-write sandbox, shell and repository tools
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/before.patch`
- Patch SHA-256: `18cfcd6b6445da15817cc1938c5629fa51ee6389a7f81b0a5f8b4669ce2c8071`

The unconstrained first attempt changed two files and 20 lines. It correctly mapped export to `ds-secondary` and preserved checkout, delete, and unknown behavior. No correction or retry was made.
