# Trigger Comparison

## Fair conditions

Before and after used the same provider, Codex agent/version, model, low-reasoning setting, temperature default, read-only runtime, repository commit, target-only router prompt, 20 protected request texts, three first-attempt decisions per request, and empty-array convention. The only changed input was the `change-review` description.

## Metrics

| Metric | Before | After |
|---|---:|---:|
| Train accuracy | 12/12 (100%) | 12/12 (100%) |
| Held-out accuracy | 7/8 (87.5%) | 8/8 (100%) |
| Held-out precision | 0.80 | 1.00 |
| Held-out recall | 1.00 | 1.00 |
| Held-out specificity | 0.75 | 1.00 |
| Overall unanimous decision rate | 1.00 | 1.00 |
| False-positive IDs | `held-compound` | none |
| False-negative IDs | none | none |

## Adoption

Adopt the revised description. It preserves perfect training recall, improves held-out accuracy and specificity, keeps every repeated decision stable, and prevents a compound request from incorrectly activating code review as a single workflow. The comparison is fair because all other environment and request inputs match exactly.
