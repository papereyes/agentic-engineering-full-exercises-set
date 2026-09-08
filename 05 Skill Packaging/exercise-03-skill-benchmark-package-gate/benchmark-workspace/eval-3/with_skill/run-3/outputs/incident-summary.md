## Timeline

- 03:14 — First valid elevated-latency signal fired; the 03:09 warning was a monitor test. [EVT-C1]
- 03:41 — The cache pool was expanded and hot keys were evicted as mitigation. [REM-C5]
- 03:49 — Read and write probes had passed for five consecutive minutes, confirming recovery. [EVT-C6]

## Impact

- 12,400 catalog requests exceeded the two-second latency objective. [IMP-C4]
- Customer count was not measured. [IMP-C4]

## Cause and uncertainty

- Production metrics confirmed cache saturation above 96 percent. [OBS-C2]
- Deployment `catalog-771` may have increased key fan-out, but this remains a hypothesis because request-level traces were unavailable. [HYP-C3]
- The supplied evidence does not establish a confirmed root cause.

## Resolution

- Engineers expanded the cache pool and evicted hot keys. [REM-C5]
- Recovery was confirmed when both read and write probes passed for five consecutive minutes at 03:49. [EVT-C6]

## Follow-up actions

- **Open — Platform:** Reproduce key fan-out under load and compare it with deployment `catalog-771`. [ACT-C2]