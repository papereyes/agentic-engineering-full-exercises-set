### Engineering review summary

Incident D caused stale analytics dashboards for some EU tenants. The affected tenant/customer count is unverified.

- **Duration conflict:** The public status page reports 18 minutes of degradation, while service logs show elevated stale-read errors for 23 minutes. The five-minute discrepancy remains unresolved; no authoritative duration is established.
- **Suspected cause:** Delayed invalidation messages may explain the stale reads, but this is unconfirmed because queue traces were not retained.
- **Remediation:** A cache invalidation change restored fresh reads. Validation covered both EU and US read paths.
- **Open action:** Data Experience owns reconciling the timing evidence and documenting the authoritative duration.

Source: [incident-d.md](/tmp/exercise-05-03-noskill-workspace/evals/files/incident-d.md)