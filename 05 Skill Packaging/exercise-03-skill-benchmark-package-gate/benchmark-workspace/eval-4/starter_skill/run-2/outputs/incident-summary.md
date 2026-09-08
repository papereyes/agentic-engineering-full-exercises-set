## Incident D: Stale analytics dashboards

**Impact:** Some EU tenants received stale dashboard data. No verified tenant or customer count is available.

**Timeline:** The public status page reports an 18-minute degradation, while service logs show elevated stale-read errors for 23 minutes. The five-minute discrepancy remains unresolved; no authoritative duration has been established.

**Cause:** Delayed cache-invalidation messages are a possible explanation, but this is unconfirmed because queue traces were not retained.

**Resolution:** A cache-invalidation change restored fresh reads. Validation covered both EU and US read paths.

**Follow-up:** Data Experience owns an open action to reconcile the status-page and service-log timings and document the authoritative incident duration.