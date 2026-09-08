## Timeline

- 14:05 — Export-latency alert opened. [EVT-B1]
- 14:38 — Worker pool increased from 8 to 16. [REM-B4]
- 14:46 — Queue recovered to normal depth. [REM-B4]

## Impact

41 customers experienced export delays exceeding 20 minutes. No export data was lost. [IMP-B2]

## Cause and uncertainty

Root cause is unconfirmed. The database team suspects a long-running lock, but its sampled lock log is incomplete. [NOTE-B3a] The worker team instead suspects starvation following a concurrency change. These explanations conflict, and current evidence does not resolve the conflict. [NOTE-B3b]

## Resolution

Increasing the worker pool from 8 to 16 mitigated the incident; the final healthy signal was the queue’s recovery to normal depth at 14:46. [REM-B4]

## Follow-up actions

- **Open — Reliability:** Reconcile the database and worker evidence before assigning root cause. [ACT-B5]