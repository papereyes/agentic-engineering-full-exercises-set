# Leadership Incident Brief: Export Queue Delay

**Impact:** 41 customers experienced export delays exceeding 20 minutes. No export data was lost.

**Timeline:** The alert opened at 14:05. At 14:38, the worker pool was increased from 8 to 16. Queue depth returned to normal by 14:46.

**Cause:** Not confirmed. The database team suspects a long-running lock, but the sampled lock log is incomplete. The worker team suspects starvation following a concurrency change. These explanations conflict, and current evidence does not resolve which—if either—was causal.

**Resolution:** Increasing worker capacity restored normal queue depth.

**Follow-up:** Reliability owns reconciling the database and worker evidence before assigning root cause. This action remains open.