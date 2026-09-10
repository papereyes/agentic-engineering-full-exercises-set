# Before and After Comparison

## Same conditions

Both first attempts started from `9c9d69d0e74b2d2c534d8c0c1464883b7fd093da`, used Codex CLI with `gpt-5.6-sol` at medium reasoning, had workspace-write shell/filesystem access, a 45-minute limit, zero human hints, and zero retries. Separate branches kept their diagrams and implementations isolated.

## Before

The stale-snapshot-led result reproduced three unsupported dependency claims and left two routing cases failing. Its diagrams looked coherent but assigned consent and fallback decisions to components that never make them.

## After

The source-led result places provider, consent, immediate-result, and durable-queue decisions under `selectNotificationRoute`. SMS is gated by consent, all six routing cases pass, both Mermaid files parse, and DEP-01 through DEP-06 match generated call edges.

## Proof

The before and after patches are full-index Git diffs from the same starting commit to separate first-attempt commits. Their SHA-256 values are recorded in the run files. `traceability.json` binds every DEP identifier to its generated edge, exact source lines, excerpts, and diagrams; the command evidence records graph build, query, and path checks.

## Conclusion

Current source and generated graph evidence reject the snapshot's invented ownership and expose the missing consent guard. The after result is both behaviorally correct and mechanically stale-detectable.
