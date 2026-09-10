# Scope comparison

## Same conditions

Both Before and After attempts began at `e134b7e7b3163db395144bfb163a06d24ad06507`, used fresh ephemeral Codex CLI sessions with `gpt-5.6-sol` at medium reasoning, workspace-write permissions, the same request and 45-minute limit, zero human hints, and zero retries.

## Before

The unconstrained first attempt happened to remain focused: two files, 20 additions, and no deletions. Its patch passes the protected migration runner. This is retained without correction, even though it leaves no historical proof that scope was decided before coding.

## After

The scoped attempt was preceded by a plan-only commit declaring two paths and a maximum of 30 changed lines. Its source commit changed exactly those paths with 18 additions and no deletions. It preserves checkout, delete, and unknown behavior while migrating export.

## Proof

Both patches reapply to the shared starting commit. `before-scope.json` matches `git apply --numstat`; `scope-budget.json` matches the actual source commit. Focused tests, typecheck, formatting, history checks, and the protected consumers all pass.

## Conclusion

The behavior outcome is equivalent, but the After lane saves two changed lines and provides enforceable pre-change scope, excluded-path, and history evidence. The result demonstrates that a budget is valuable even when an unconstrained agent behaves well: it makes review boundaries reproducible instead of accidental.
