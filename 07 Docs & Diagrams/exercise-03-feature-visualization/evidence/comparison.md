# Before and After Comparison

## Same conditions

Both first attempts started from `9c9d69d0e74b2d2c534d8c0c1464883b7fd093da`, used Codex CLI with `gpt-5.6-sol` at medium reasoning, had workspace-write shell/filesystem access, a 75-minute limit, zero human hints, and zero retries. Separate branches kept their artifacts independent.

## Before

The brief-led diagrams invented a direct checkout-to-gateway call and retry, assumed signed webhooks were known, and wrote a ledger entry for every delivery. Unknown-reference and duplicate cases failed, and the ER diagram did not parse.

## After

The incident-backed implementation validates signature, known reference, and duplicate event ID before any ledger mutation. Its diagrams contain only implemented relationships, all required feature and webhook cases pass, and every Mermaid file parses.

## Proof

The full-index patches compare the same starting commit with separate first-attempt commits, and each run records its patch SHA-256. `traceability.json` maps VIS-01 through VIS-16 to exact source marker lines and required diagrams. Contradiction and command evidence independently record the rejected brief claims and successful observed flows.

## Conclusion

The source-and-incident-led attempt replaces optimistic product prose with verifiable trust, idempotency, architecture, sequence, state, and data relationships.
