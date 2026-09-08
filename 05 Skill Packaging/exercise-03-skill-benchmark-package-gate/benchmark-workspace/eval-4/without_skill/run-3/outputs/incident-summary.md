### Incident D: Stale analytics dashboards

- **Impact:** Some EU tenants received stale dashboards. No verified tenant or customer count exists.
- **Duration:** Conflicting evidence remains unresolved:
  - Public status page: **18 minutes**
  - Service logs: elevated stale-read errors for **23 minutes**
- **Suspected cause:** Delayed invalidation messages may explain the stale reads, but this is unconfirmed because queue traces were not retained.
- **Remediation:** A cache invalidation change restored fresh reads. Validation covered EU and US read paths.
- **Open action:** Data Experience must reconcile the status-page and service-log timelines and document the authoritative duration.

No impact count or definitive root cause should be inferred from the available evidence.