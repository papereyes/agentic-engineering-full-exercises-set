# Post-Incident Report: Cache Saturation

## Summary

Production cache utilization exceeded 96%, coinciding with elevated catalog-request latency. The first valid alert fired at 03:14. The cache pool was expanded and hot keys were evicted at 03:41; recovery was confirmed at 03:49 after read and write probes passed continuously for five minutes.

## Impact

- 12,400 catalog requests exceeded the two-second latency objective.
- The number of affected customers was not measured.
- Available notes do not establish whether requests failed or only experienced elevated latency.
- The exact start of customer impact is unknown; 03:14 marks the first valid signal, not necessarily the onset.

## Timeline

| Time | Event |
|---|---|
| 03:09 | Warning generated as part of a monitor test; not an incident signal. |
| 03:14 | First valid elevated-latency signal fired. |
| During incident | Production metrics verified cache saturation above 96%. |
| 03:41 | Cache pool expanded and hot keys evicted. |
| 03:49 | Recovery confirmed after read and write probes passed for five consecutive minutes. |

From the first valid signal to confirmed recovery, the observed incident window was 35 minutes.

## Cause

The root cause has not been confirmed.

Deployment `catalog-771` may have increased cache-key fan-out, but this remains a hypothesis. Request-level traces were unavailable, so the deployment cannot yet be causally linked to the saturation. The evidence currently supports cache saturation as the condition associated with the latency degradation, not its underlying cause.

## Mitigation and Recovery

Engineers expanded the cache pool and evicted hot keys at 03:41. Subsequent probe results indicate that service recovered: both read and write probes passed for five consecutive minutes, with recovery confirmed at 03:49.

The available evidence does not distinguish which mitigation action—or combination of actions—produced the recovery.

## Follow-up

| Action | Owner | Status |
|---|---|---|
| Reproduce cache-key fan-out under load and compare the results with deployment `catalog-771`. | Platform | Open |

The investigation should retain alternative explanations until testing establishes whether `catalog-771` materially changed key fan-out. Improving request-level trace availability would also make similar incidents easier to attribute and quantify.