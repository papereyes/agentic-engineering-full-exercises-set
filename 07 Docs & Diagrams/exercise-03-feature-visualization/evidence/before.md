# Before — legacy-brief-led first attempt

Starting commit: 9c9d69d0e74b2d2c534d8c0c1464883b7fd093da
Run base commit: 9c9d69d0e74b2d2c534d8c0c1464883b7fd093da
Implementation commit: 081f43d59d702ad6e2d5a9b18ff4afe7f405be83
Agent and model: Codex CLI gpt-5.6-sol with medium reasoning
Tools and permissions: Codex CLI shell and workspace-write filesystem access
Time limit: 75 minutes
Human hints: 0
Retries: 0
Patch SHA-256: df7764d3c04d82b4ac89f7f58c8ac4655da8c983a39b537cace79f6a0b29e577

## Input and isolation

The fresh session received only the legacy feature brief and the visualization request in `evidence/commands/before-prompt.txt`. It could not inspect source, tests, incident details, diagram contracts, or protected files. Its branch started at the shared commit and contained none of the source-led attempt.

## Result

The session created four diagrams that repeated the brief's direct-gateway call, authorization retry, assumed-known webhook reference, and ledger-write-on-every-delivery claims. The unchanged webhook suite failed the unknown-reference and duplicate-delivery cases. Three diagrams parsed, while `payment-data.mmd` produced a Mermaid ER parse error; this genuine first-attempt failure is preserved rather than repaired after the run.

## Conclusion

The brief-led attempt misses the incident's trust and idempotency boundaries, invents unsupported behavior, and does not achieve syntactically valid evidence across all four diagrams.
