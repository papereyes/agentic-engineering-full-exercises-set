# Post-Incident Report: Cache Saturation

## Summary

Production cache saturation coincided with elevated catalog-request latency. The cache pool was expanded and hot keys were evicted, after which read and write probes passed for five consecutive minutes.

The underlying cause has not been confirmed. Deployment `catalog-771` may have increased key fan-out, but request-level traces were unavailable to validate this hypothesis.

## Impact

- 12,400 catalog requests exceeded the two-second latency objective.
- The number of affected customers was not measured.
- No additional customer or system impact was established from the available notes.

## Timeline

| Time | Event |
|---|---|
| 03:09 | A warning was generated as part of a monitor test; this was not a valid incident signal. |
| 03:14 | The first valid elevated-latency signal fired. |
| During incident | Production metrics confirmed cache saturation above 96%. |
| 03:41 | Responders expanded the cache pool and evicted hot keys. |
| 03:49 | Recovery was confirmed after read and write probes passed for five consecutive minutes. |

The observed interval from the first valid alert to confirmed recovery was 35 minutes. This does not necessarily represent the exact customer-impact window.

## Cause and Contributing Factors

The root cause remains undetermined.

Deployment `catalog-771` is a suspected contributor because it may have increased cache-key fan-out. This has not been verified due to the absence of request-level traces. The available evidence establishes cache saturation and elevated latency, but does not establish what caused the saturation.

## Resolution

The incident was mitigated by:

- Expanding the cache pool.
- Evicting hot keys.

Recovery was confirmed at 03:49 through five consecutive minutes of successful read and write probes.

## Follow-up Actions

| Action | Owner | Status |
|---|---|---|
| Reproduce key fan-out under load and compare the results with deployment `catalog-771`. | Platform | Open |

## Review Gaps

Further investigation should clarify:

- Whether `catalog-771` materially changed key fan-out.
- Why request-level traces were unavailable.
- The number of customers affected.
- Whether cache-capacity or saturation alerts provide sufficient time for mitigation.