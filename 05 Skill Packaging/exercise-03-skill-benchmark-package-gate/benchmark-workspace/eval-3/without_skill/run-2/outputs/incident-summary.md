# Post-Incident Report: Cache Saturation

## Summary

A production cache saturation event caused elevated catalog-request latency. Cache utilization above 96% was verified, and 12,400 catalog requests exceeded the two-second latency objective.

The first valid alert fired at 03:14. At 03:41, responders expanded the cache pool and evicted hot keys. Recovery was confirmed at 03:49 after read and write probes passed continuously for five minutes.

The underlying cause has not been established. Deployment `catalog-771` may have increased key fan-out, but request-level traces were unavailable, so this remains a hypothesis.

## Impact

- 12,400 catalog requests exceeded the two-second latency objective.
- The number of affected customers was not measured.
- No other customer or system impact is established by the incident record.

## Timeline

*Times are as recorded; the date and time zone were not provided.*

| Time | Event |
|---|---|
| 03:09 | A warning occurred as part of a monitor test; it was not a valid incident signal. |
| 03:14 | The first valid elevated-latency signal fired. |
| During incident | Production metrics verified cache saturation above 96%. |
| 03:41 | The cache pool was expanded and hot keys were evicted. |
| 03:49 | Recovery was confirmed after read and write probes passed for five consecutive minutes. |

The elapsed time from the first valid signal to confirmed recovery was approximately 35 minutes. Remediation began or completed 27 minutes after that signal; the record does not distinguish which.

## Cause and contributing factors

**Confirmed condition:** Production cache saturation exceeded 96%.

**Unconfirmed hypothesis:** Deployment `catalog-771` may have increased key fan-out and contributed to saturation.

A causal link cannot currently be established because request-level traces were unavailable. The available evidence also does not show whether cache expansion, hot-key eviction, or their combined effect produced the recovery.

## Response and recovery

Responders:

- Expanded the cache pool.
- Evicted hot keys.
- Monitored read and write probes until both passed for five consecutive minutes.

These actions were followed by confirmed recovery, although the evidence does not isolate the effect of either action.

## Follow-up action

| Action | Owner | Status |
|---|---|---|
| Reproduce key fan-out under load and compare the results with deployment `catalog-771`. | Platform | Open |

The investigation should preserve the distinction between correlation and causation and document whether the deployment reproduces the observed saturation. Improving request-level trace availability should also be considered, but this is a recommendation rather than an action recorded in the source incident notes.