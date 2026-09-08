# Post-Incident Report: Cache Saturation

## Summary

At 03:14, production monitoring detected elevated catalog-request latency alongside verified cache saturation above 96%. The cache pool was expanded and hot keys were evicted at 03:41. Recovery was confirmed at 03:49 after read and write probes passed for five consecutive minutes.

The confirmed incident window was approximately 35 minutes, from the first valid alert to confirmed recovery.

## Impact

- 12,400 catalog requests exceeded the two-second latency objective.
- The number of affected customers was not measured.
- The available notes do not establish whether requests failed or only experienced elevated latency.

## Timeline

| Time | Event |
|---|---|
| 03:09 | A warning occurred as part of a monitor test; it was not a valid incident signal. |
| 03:14 | The first valid elevated-latency signal fired. |
| During incident | Production metrics confirmed cache saturation above 96%. |
| 03:41 | Responders expanded the cache pool and evicted hot keys. |
| 03:49 | Recovery was confirmed after read and write probes passed for five consecutive minutes. |

## Cause

The immediate condition associated with the incident was cache saturation above 96%.

The underlying cause has not been confirmed. Deployment `catalog-771` may have increased key fan-out, but this remains a hypothesis because request-level traces were unavailable. Current evidence is insufficient to attribute the incident to that deployment.

## Resolution

Responders expanded the cache pool and evicted hot keys. Subsequent read and write probes passed for five consecutive minutes, confirming service recovery.

The available evidence does not distinguish which remediation action contributed most to recovery.

## Follow-up Actions

| Action | Owner | Status |
|---|---|---|
| Reproduce key fan-out under load and compare the results with deployment `catalog-771`. | Platform | Open |

The investigation should preserve the distinction between correlation and causation until the suspected fan-out behavior is reproduced or supported by additional evidence.