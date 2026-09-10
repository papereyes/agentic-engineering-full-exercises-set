# Before — legacy-document-led first attempt

Starting commit: e83928ed3c4d34fd51039c65b3d86373687cb259
Run base commit: e83928ed3c4d34fd51039c65b3d86373687cb259
Implementation commit: d4a89b6bfe8d13546213d9e0709823dd1108b521
Agent and model: Codex CLI gpt-5.6-sol with medium reasoning
Tools and permissions: Codex CLI shell and workspace-write filesystem access
Time limit: 45 minutes
Human hints: 0
Retries: 0
Patch SHA-256: 690c1809a2cd68abfab55a55d3c01a24aaf2bb4a97092a9d66f5bb2db04b77dc

## Input and isolation

The fresh session received only the legacy workflow description and the diagram request recorded in `evidence/commands/before-prompt.txt`. It was explicitly prohibited from reading implementation, tests, trace scripts, protected contracts, or existing diagrams. Its branch began at the shared starting commit and did not contain the source-led attempt.

## Result

The session created three Mermaid files and changed no application or verifier source. `npm run diagrams:parse` exited 0 for all three files. The semantic verifier exited 1 as expected: it reported ten missing required state transitions, seven unsupported state transitions, twenty-one missing edge markers, missing required actors/interactions, and absent evidence.

The attempt copied the legacy document's automatic retry, direct manager-to-data-owner routing, external security review, external rollback ownership, and sole `provisioned` completion claim. It therefore omitted the implemented high-risk security path and the failed-provisioning to rollback completion path.

## Conclusion

This first attempt is useful only as the controlled before result. Its syntax is valid, but its behavior and traceability are not implementation-backed.
