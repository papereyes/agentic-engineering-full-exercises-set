# Trigger Comparison

## Fair conditions

Before and after used the same provider, Codex agent/version, model, low-reasoning setting, temperature default, read-only runtime, repository commit, target-only router prompt, 20 protected request texts, three independent first-attempt sessions per request, and empty-array convention. Each of the 120 decisions has a distinct thread ID, actual timestamp, complete retained response, and response hash. The only changed routing input was the `change-review` description.

## Metrics

| Metric | Before | After |
|---|---:|---:|
| Train accuracy | 9/12 (75%) | 12/12 (100%) |
| Held-out accuracy | 4/8 (50%) | 8/8 (100%) |
| Held-out precision | 0.50 | 1.00 |
| Held-out recall | 1.00 | 1.00 |
| Held-out specificity | 0.00 | 1.00 |
| Overall unanimous decision rate | 0.95 | 1.00 |
| False-positive IDs | train: `train-release`, `train-pr-summary`, `train-review-advice`; held-out: `held-release-paraphrase`, `held-design-review`, `held-diff-summary`, `held-compound` | none |
| False-negative IDs | none | none |

## Adoption

Adopt the revised description. It preserves perfect recall, improves training accuracy by 25 points and held-out accuracy by 50 points, reaches perfect held-out specificity, and makes every repeated decision stable. The comparison is fair because all other environment and request inputs match exactly.
