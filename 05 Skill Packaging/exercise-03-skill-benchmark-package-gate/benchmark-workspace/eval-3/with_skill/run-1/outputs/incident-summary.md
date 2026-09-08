## Timeline

- 03:14 — The first valid elevated-latency signal fired. The 03:09 warning was a monitor test, not a valid incident signal. [EVT-C1]
- Cache saturation above 96 percent was verified in production metrics. [OBS-C2]
- 03:41 — The cache pool was expanded and hot keys were evicted as mitigation. [REM-C5]
- 03:49 — Read and write probes passed for five consecutive minutes, confirming recovery. [EVT-C6]

## Impact

12,400 catalog requests exceeded the two-second latency objective. The number of affected customers was not measured. [IMP-C4]

## Cause and uncertainty

The confirmed technical condition was cache saturation above 96 percent. [OBS-C2]

Deployment `catalog-771` may have increased key fan-out, but this remains a hypothesis. Request-level traces were unavailable, so the deployment’s role and the underlying cause have not been confirmed. [HYP-C3]

## Resolution

At 03:41, responders expanded the cache pool and evicted hot keys. [REM-C5] Recovery was confirmed at 03:49 after both read and write probes passed for five consecutive minutes. [EVT-C6]

## Follow-up actions

- **Open — Platform:** Reproduce key fan-out under load and compare the results with deployment `catalog-771`. [ACT-C2]