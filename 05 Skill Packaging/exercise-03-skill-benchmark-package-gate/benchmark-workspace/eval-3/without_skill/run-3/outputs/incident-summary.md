# Post-Incident Report: Cache Saturation

## Timeline

- **03:09** — A warning was generated as part of a monitor test; it was not a valid production signal. [EVT-C1]
- **03:14** — The first valid elevated-latency signal fired. [EVT-C1]
- **03:41** — The cache pool was expanded and hot keys were evicted. [REM-C5]
- **03:49** — Recovery was confirmed after read and write probes passed for five consecutive minutes. [EVT-C6]

## Impact

- **12,400 catalog requests** exceeded the two-second latency objective. [IMP-C4]
- The number of affected customers was not measured, so customer impact cannot be quantified from the available evidence. [IMP-C4]

## Cause and uncertainty

Production metrics confirm that cache saturation exceeded 96%. [OBS-C2]

Deployment `catalog-771` may have increased key fan-out, but this remains an unconfirmed hypothesis. Request-level traces were unavailable, so the deployment cannot currently be identified as the root cause. [HYP-C3]

## Resolution

At 03:41, responders expanded the cache pool and evicted hot keys. [REM-C5] Recovery was confirmed at 03:49 by five consecutive minutes of successful read and write probes. [EVT-C6]

The evidence establishes that recovery followed the cache intervention, but does not by itself prove the underlying cause.

## Follow-up actions

- **Open — Platform:** Reproduce key fan-out under load and compare the results with deployment `catalog-771`. [ACT-C2]
- Use the reproduction results to confirm or reject the deployment hypothesis before assigning root cause.