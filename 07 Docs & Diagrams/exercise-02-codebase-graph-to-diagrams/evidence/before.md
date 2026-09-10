# Before — stale-snapshot-led first attempt

Starting commit: 9c9d69d0e74b2d2c534d8c0c1464883b7fd093da
Run base commit: 9c9d69d0e74b2d2c534d8c0c1464883b7fd093da
Implementation commit: 5b8ce4640a3a1d1b80b8e01fdfdc4bff3e008f54
Agent and model: Codex CLI gpt-5.6-sol with medium reasoning
Tools and permissions: Codex CLI shell and workspace-write filesystem access
Time limit: 45 minutes
Human hints: 0
Retries: 0
Patch SHA-256: 1d213e5c1628cb21710d162a5f3a9fc5e126cdb10fb2c86948386d76303c0254

## Input and isolation

The fresh session received only the stale graph snapshot and the diagram request recorded in `evidence/commands/before-prompt.txt`. It could not inspect source, tests, the graph builder, the current routing contract, or protected contracts. Its branch began at the shared starting commit and did not contain the source-led attempt.

## Result

The session produced two Mermaid diagrams and changed no application or verifier source. The diagrams repeated unsupported snapshot edges from `smsAvailable` and `emailAvailable` to `hasSmsConsent`, plus an unsupported `immediateRoute` to `durableQueueRoute` fallback. The unchanged routing tests also failed two required cases: SMS without consent selected SMS instead of email, and no permitted provider selected SMS instead of the durable queue.

## Conclusion

This controlled before result shows that a stale dependency snapshot can produce plausible diagrams while preserving both incorrect ownership and broken routing behavior.
