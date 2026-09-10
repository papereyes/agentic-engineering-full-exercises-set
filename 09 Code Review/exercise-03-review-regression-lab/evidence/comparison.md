# Before and After comparison

## Same conditions

The Before Baseline and After Skill-assisted lanes each contain three runner-captured sessions covering the identical protected historical regression, security regression, and clean control. Both lanes use Codex with GPT-5.6 Sol, read-only permissions, the same executable adapter, a nine-minute case limit, normalized prompts, and zero human hints or retries. Unique run nonces and transcript hashes prevent any result from being reused as another.

## Proof

Every run records its source commit, protected diff hash, normalized prompt hash, transcript hash, adapter hash, runner hash, nonce, and session identifier. The scorer reconstructs metrics from those raw artifacts. The Baseline achieved 1.0 historical Coverage, 1.0 security Coverage, 0.7777777778 Precision, and 1.0 Clean control accuracy. It found the supported regressions but split them into nine blockers for seven rules. The Skill-assisted lane achieved 1.0 for all four metrics, preserving complete coverage while consolidating the evidence into exactly seven supported blockers.

The corrected evaluation rule tests that a specific status selection includes only that status, which is the behavior actually broken by the protected diff. The previous wording claimed the wildcard selection was broken even though the boolean expression made that branch true. This keeps the benchmark aligned with executable behavior instead of rewarding a fabricated finding.

## Conclusion

The improvement comes from a focused documentation change rather than protected case answers. The skill tells reviewers to inventory requirements, trace changed decisions through callers and observable state, exercise filter choices with representative truth tables, reproduce behavior before declaring a blocker, and consolidate findings by distinct rule or root cause. It names no protected case, file, anchor, or expected finding. Since every adoption gate passes—including no regression on security coverage or the clean control—the evidence-backed Decision is `adopt`.
