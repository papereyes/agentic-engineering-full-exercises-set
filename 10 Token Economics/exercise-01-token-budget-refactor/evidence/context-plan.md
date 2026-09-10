# Context budget plan

This plan is committed before selector or adapter source changes. The full before lane costs 2,885 UTF-8 bytes and includes stale and unrelated material. The selected lane has a maximum of 2,000 bytes and must never exceed it.

`repository-rules` is mandatory because it establishes compatibility, testing, scope, and evidence constraints. `current-adapter-contract` is the primary current authority for the adapter and session tags. It defines output shape, first-occurrence role deduplication, synchronous behavior, validation, and serialization.

One open question remains after the primary contract: which exact error codes, messages, and validation order are public behavior? That question adds the `errors` question tag, selecting `current-error-contract`. The expected selected order is therefore `repository-rules`, `current-adapter-contract`, then `current-error-contract`, totaling 1,867 bytes.

The stale `legacy-migration-notes` source is excluded regardless of its higher numeric priority because current authority wins. The UI style guide and audit retention policy are excluded as irrelevant to this server-side compatibility refactor. If mandatory context alone cannot fit, selection must fail instead of silently dropping repository rules. If a relevant source cannot fit, it must be recorded as skipped for budget and its tags reported unresolved.
