# Full versus progressive context

## Same conditions

Both Before and After lanes started at `e134b7e7b3163db395144bfb163a06d24ad06507`, used a fresh ephemeral Codex CLI session with `gpt-5.6-sol` at medium reasoning, workspace-write permissions, the same adapter request, a 45-minute limit, zero human hints, and zero retries. Each patch records its genuine first attempt.

## Before

The full-context lane loaded all six catalog sources and 2,885 UTF-8 bytes. It included one stale source and two irrelevant sources. The adapter contract passed, but the implementation/test patch was 119 changed lines across two files.

## After

The planned selector loaded three authoritative sources and 1,867 bytes: mandatory repository rules, the current adapter contract, and the current error contract selected by the open question. It loaded no stale or irrelevant sources, missed no mandatory rule, and left 133 bytes. Both selector and adapter verification passed; the source snapshot contains the two implementations and their two focused learner tests.

## Proof

`before.patch` and `after.patch` replay against the common starting commit and pass the protected adapter acceptance runner. `context-ledger.json` exactly reproduces selector output for every catalog entry. The plan commit is the direct parent of the four-file source commit, and all later changes are evidence only.

## Conclusion

The After lane reduced context by 1,018 bytes (35.3%) and removed all three stale or irrelevant sources without sacrificing correctness. The result supports progressive, authority-aware context selection over full-context loading for this bounded refactor.
