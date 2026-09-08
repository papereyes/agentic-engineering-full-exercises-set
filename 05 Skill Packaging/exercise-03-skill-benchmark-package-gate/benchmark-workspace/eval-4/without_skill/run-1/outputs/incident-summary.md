### Incident D — Engineering review summary

Some EU tenants received stale analytics dashboards; no verified tenant or customer count is available.

- **Duration:** Public status reported 18 minutes, while service logs showed elevated stale-read errors for 23 minutes. The five-minute discrepancy remains unresolved.
- **Suspected cause:** Delayed invalidation messages may explain the stale reads, but this is unconfirmed because queue traces were not retained.
- **Remediation:** A cache-invalidation change restored fresh reads. Validation covered both EU and US read paths.
- **Open action:** Data Experience must reconcile the status-page and log timings and document the authoritative incident duration.

Do not treat either duration as authoritative or infer an affected-customer count until the open evidence gaps are resolved.