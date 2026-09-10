# Context decision

The planned maximum was 2,000 UTF-8 bytes. The actual deterministic selection used 1,867 bytes (`1867` in the machine ledger) and left 133 bytes unused. It selected the mandatory repository rules first, followed by the current adapter contract for the task tags and the current error contract after the open question expanded context with the `errors` tag.

The actual selection matched the planned three IDs and their order. No mandatory source was missed. The legacy migration notes were excluded because their authority is stale even though their tags match. The UI style guide and audit-retention material were excluded as irrelevant. Every catalog entry has an explicit selected or skipped reason in the ledger.

Verification passed for real UTF-8 source costs, authority ordering, deterministic tie-breaking, tight-budget handling, mandatory overflow, duplicate IDs, question expansion, the protected adapter acceptance suite, the learner regression tests, typecheck, and formatting. The selected-context fresh attempt preserved exact synchronous errors and found a sparse-array roles edge case without consulting unrelated material.

Correctness is protected by current contracts plus executable tests, not by loading every available document. The trade-off is deliberate: a later task with UI, audit, or retention requirements must expand the task or question tags and rerun selection. For this adapter-only refactor, cutting 1,018 bytes and three irrelevant or stale sources reduces distraction while retaining all authoritative behavior constraints.
