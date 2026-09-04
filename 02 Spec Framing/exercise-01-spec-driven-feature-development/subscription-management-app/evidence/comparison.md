# Before and after comparison

### Same conditions

Both first attempts began at the same commit and used the same product request, fresh Codex agent, model, tools, permissions, time limit, and zero human hints or retries. The only intended difference was that the after run could read `specs/clarifications.md`.

### Fair Comparison

| Condition | Before | After | Same? |
|---|---|---|---|
| Starting commit | `52090edddf032d026ece16ef90feb627bf8e67ac` | `52090edddf032d026ece16ef90feb627bf8e67ac` | Yes |
| Product request | Allow users to manage their subscriptions. | Allow users to manage their subscriptions. | Yes |
| Agent and model | OpenAI Codex; gpt-5.6-sol, medium reasoning | OpenAI Codex; gpt-5.6-sol, medium reasoning | Yes |
| Tools and permissions | Codex workspace tools; workspace-write filesystem, restricted network, no automatic approval | Codex workspace tools; workspace-write filesystem, restricted network, no automatic approval | Yes |
| Time limit | 30 minutes | 30 minutes | Yes |
| Human hints | 0 | 0 | Yes |
| Attempts | 1 | 1 | Yes |

### Results

| Metric | Before | After |
|---|---|---|
| Invented decisions | 5 | 0 hidden; 4 explicit release-blocking assumptions |
| Missed questions | 5 | 0 |
| Testable acceptance criteria | 13 | 12 |
| Traceability gaps | 0 | 0 |
| Validation result | Structurally complete but unsupported decisions remained | `npm run spec:verify` passed, exit code 0 |

### Improvements

- Q1 makes the unresolved cancellation permission visible and release-blocking; REQ-001 and `specs/spec.md` now distinguish UI visibility from server authorization.
- Q2 records the billing/support conflict before choosing timing; REQ-002 and REQ-003 in `specs/spec.md` now require authoritative effect timing and provider-backed previews.
- Q3 separates the confirmed plan-change constraint from the broader first-release pending-work assumption traced through REQ-004, REQ-005, the plan, tasks, and release conditions.
- Q4 prevents an invented retry path: REQ-006 in `specs/spec.md` requires reconciliation before a fresh attempt and safe customer-visible errors.
- Q5 maps to the specification's Scope and Release Conditions so the first release avoids inventing Enterprise approvals or unsupported billing workflows.

### Proof

`evidence/before.patch` and `evidence/after.patch` are full-index binary Git diffs from the common starting commit to their exact implementation commits. Their SHA-256 values are recorded in the corresponding run files.

### Conclusion

Clarification made the specification safer to implement. The after result has no missed decision categories or hidden invented choices: five unresolved assumptions are traceable through Q1-Q5 into requirements, scope, and release conditions, while both runs retained complete structural traceability.
