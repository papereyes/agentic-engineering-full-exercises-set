## Timeline

- The public status page recorded an **18 minutes** degradation window [EVT-D1].
- Service logs recorded elevated stale-read errors for **23 minutes** [LOG-D4].
- The five-minute discrepancy remains unresolved [LOG-D4].

## Impact

Some EU tenants received stale dashboards; no verified tenant or customer count exists [IMP-D3].

## Cause and uncertainty

Delayed invalidation messages are a hypothesis for the stale reads, but this is unconfirmed because queue traces were not retained [HYP-D6].

## Resolution

Recovery occurred after a cache invalidation change restored fresh reads, validated across the EU and US read paths [REM-D5].

## Follow-up actions

- **Open — Data Experience:** Reconcile status-page timing with service logs and document the authoritative duration [ACT-D2].