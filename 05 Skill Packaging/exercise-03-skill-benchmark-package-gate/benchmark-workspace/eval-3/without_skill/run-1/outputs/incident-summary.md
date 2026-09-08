# Post-Incident Report: Cache Saturation

## Summary

Production cache saturation exceeded 96%, coinciding with elevated catalog-request latency. The first valid alert fired at 03:14. At 03:41, the cache pool was expanded and hot keys were evicted. Recovery was confirmed at 03:49 after read and write probes passed for five consecutive minutes.

Deployment `catalog-771` may have increased key fan-out, but this is unconfirmed because request-level traces were unavailable.

## Customer impact

- 12,400 catalog requests exceeded the two-second latency objective.
- The number of affected customers was not measured.
- No evidence was provided about request failures, data loss, or incorrect responses.

## Timeline

| Time | Event |
|---|---|
| 03:09 | A warning fired as part of a monitor test; it was not a valid incident signal. |
| 03:14 | First valid elevated-latency signal fired. |
| 03:41 | Cache pool expanded and hot keys evicted. |
| 03:49 | Recovery confirmed after read and write probes passed for five consecutive minutes. |

All times are as recorded; the source does not specify a timezone.

## Detection and duration

The incident was detected through the elevated-latency monitor at 03:14. Mitigation occurred 27 minutes later, and recovery was confirmed 35 minutes after the first valid signal.

These durations use alert time as the starting point; the actual onset time is unknown.

## Technical findings

Production metrics verify cache saturation above 96%. The available evidence establishes a correlation between saturation and elevated latency, but does not fully establish the underlying cause.

The leading hypothesis is that deployment `catalog-771` increased cache-key fan-out. Request-level traces were unavailable, so the deployment’s role and the mechanism of saturation remain unverified.

## Mitigation and recovery

Engineers expanded the cache pool and evicted hot keys at 03:41. Read and write probes subsequently passed for five consecutive minutes, confirming recovery at 03:49.

The evidence supports these actions as effective mitigation, but does not establish which action—or combination of actions—resolved the condition.

## Follow-up action

| Action | Owner | Status |
|---|---|---|
| Reproduce key fan-out under load and compare the results with deployment `catalog-771`. | Platform | Open |

The investigation should also capture request-level traces during reproduction so the key-fan-out hypothesis can be confirmed or rejected. No owner or status has yet been recorded for that additional recommendation.