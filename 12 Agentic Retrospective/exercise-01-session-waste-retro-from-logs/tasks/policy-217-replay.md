# POLICY-217 Replay Brief

Update `src/policy.ts` so escalated cases follow the current rule in `docs/contract.md`. Preserve the public response shape, add or update a focused test, and report whether the change is complete.

Represent the attempt as ordered raw session events using the event fields in `docs/metric-contract.md`. The scenario starts at workspace revision 1. A source write advances the revision. Record reads, context loads, commands, diagnoses, writes, and the final completion decision in the order they occur.

This is a controlled constructed replay because the original application is not included. Do not claim that the event file is an exported provider trace.
