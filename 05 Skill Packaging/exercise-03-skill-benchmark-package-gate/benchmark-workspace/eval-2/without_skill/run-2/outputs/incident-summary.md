### Leadership Incident Brief: Export Queue Delay

At 14:05, an export-latency alert identified delayed processing. Forty-one customers experienced export delays exceeding 20 minutes; no export data was lost.

At 14:38, the worker pool was increased from 8 to 16. Queue depth returned to normal by 14:46.

Root cause remains unresolved. The database team suspects a long-running lock, but lock-log evidence is incomplete. The worker team suspects starvation following a concurrency change. These explanations conflict, and neither is confirmed.

Reliability owns the open action to reconcile the database and worker evidence before assigning root cause.