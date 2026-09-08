### Leadership Incident Brief — Export Queue Delay

- **Impact:** 41 customers experienced export delays exceeding 20 minutes. No export data was lost.
- **Timeline:** Alert opened at 14:05. The worker pool was increased from 8 to 16 at 14:38; queue depth returned to normal by 14:46.
- **Status:** Service recovered.
- **Root cause:** Unresolved. Evidence is incomplete and two hypotheses conflict: a long-running database lock versus worker starvation following a concurrency change.
- **Next action:** Reliability will reconcile database and worker evidence before assigning root cause.