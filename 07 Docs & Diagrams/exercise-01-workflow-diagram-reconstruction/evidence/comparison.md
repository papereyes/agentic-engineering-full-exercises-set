# Before and After Comparison

## Same conditions

Both first attempts started from `e83928ed3c4d34fd51039c65b3d86373687cb259`, used Codex CLI with `gpt-5.6-sol` at medium reasoning, had workspace-write shell/filesystem access, a 45-minute limit, zero human hints, and zero retries. Separate branches prevented either result from inheriting the other's diagrams.

## Before

The legacy-led result parsed as Mermaid but reproduced stale claims. Its state graph used unsupported aliases, omitted all ten trace markers, invented a provisioning retry loop, bypassed implemented high-risk security routing, and never showed application-owned rollback completion. The semantic verifier rejected it.

## After

The implementation-backed result maps all ten workflow edges to exact source markers. It distinguishes high risk from normal risk, healthy from unhealthy provisioning, and provisioned from rolled-back completion. All required actors and paths are present, and the parser and protected scenario trace pass against the recorded source SHA.

## Proof

The before and after patches are exact full-index Git diffs from their shared starting commit to their separate implementation commits, with SHA-256 values recorded in each run file. `traceability.json` binds WF-01 through WF-10 to exact source lines and required diagrams. `contradictions.md` records four legacy conflicts and the UI progress conflict without changing protected source.

## Conclusion

Source-led reconstruction removed the unsupported automatic retry and restored the security and rollback paths hidden by the legacy document. The final diagrams are implementation-backed and remain mechanically stale-detectable through their source SHA, exact citations, hashes, and command evidence.
