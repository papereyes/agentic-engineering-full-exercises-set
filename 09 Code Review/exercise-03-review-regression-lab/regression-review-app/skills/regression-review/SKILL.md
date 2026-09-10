---
name: regression-review
description: Use when reviewing a pull request, patch, or code diff for behavioral regressions and deciding whether it is safe to merge.
---

# Regression Review

## Method

1. Read the request, every acceptance rule, and the exact diff before forming conclusions. Create a private checklist with one row per rule; none may remain unevaluated.
2. For each changed value or decision, trace the path through callers, persisted state, rendering, and trusted server boundaries as relevant. Inspect surrounding code when the diff alone cannot establish behavior.
3. Reproduce each suspected failure with a concrete input and observable result. For filters, use a truth table covering the wildcard choice and every category. Compare with prior behavior when compatibility matters. A plausible concern is not a blocker.
4. Check only relevant risk lenses: authorization and input trust, accessibility semantics, state mutation and persistence, error and empty-data paths, and missing regression coverage.
5. Consolidate evidence by root cause. Report one finding for each distinct violated rule; do not split one behavior into duplicate blockers. If one defect violates multiple rules, name each affected rule in that single finding.
6. Dismiss an unsupported claim explicitly with the inspected path and reproduction result. If every rule conforms, approve the change.

## Finding contract

Every finding contains:

- severity: critical for exploitable trust-boundary compromise, high for data loss or blocked core work, medium for bounded incorrect behavior, low for limited impact;
- changed file and an exact added-line code anchor;
- the acceptance rule being evaluated;
- failing scenario, observed behavior, and user or system impact;
- reproduction evidence and focused remediation;
- verification advice naming the regression that should fail before and pass after;
- a blocking decision supported by the reproduced impact.

Before returning, reconcile the checklist against the findings: every violated rule has evidence, every blocker has a reproduction, no code anchor is reused for separate findings, and conforming rules have not produced speculative blockers.

## Common mistakes

| Mistake | Correction |
| --- | --- |
| Reviewing only obvious changed lines | Trace their downstream state and boundary effects. |
| Treating a warning as proof | Reproduce the behavior before assigning severity. |
| Repeating the same root cause | Merge duplicates and preserve all affected rules. |
| Assuming unchanged code is safe | Check how the new path changes its inputs or obligations. |
| Blocking a safe alternative implementation | Judge observable acceptance behavior, not preferred syntax. |
