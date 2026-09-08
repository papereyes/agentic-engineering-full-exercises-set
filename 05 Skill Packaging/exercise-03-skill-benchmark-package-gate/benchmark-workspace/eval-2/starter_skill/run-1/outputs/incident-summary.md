# Leadership Incident Brief: Export Queue Delay

**Impact:** 41 customers experienced export delays exceeding 20 minutes. No export data was lost.

**Timeline:**

- 14:05 — Export-latency alert opened.
- 14:38 — Worker pool increased from 8 to 16.
- 14:46 — Queue returned to normal depth.

**Cause:** Not confirmed. Evidence currently supports two conflicting possibilities: a long-running database lock or worker starvation following a concurrency change. The sampled lock log is incomplete, so neither explanation has been validated.

**Resolution:** Increasing worker capacity restored normal queue depth.

**Follow-up:** Reliability owns reconciling the database and worker evidence before assigning root cause. This action remains open.