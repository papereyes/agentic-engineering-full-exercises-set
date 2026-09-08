## Timeline

- The public status page records an **18 minutes** degradation window [EVT-D1].
- Service logs record elevated stale-read errors for **23 minutes** [LOG-D4].
- The five-minute discrepancy remains unresolved; no authoritative duration is established [EVT-D1] [LOG-D4].

## Impact

- Some EU tenants received stale dashboards [IMP-D3].
- No verified tenant or customer count exists [IMP-D3].

## Cause and uncertainty

- Delayed invalidation messages are a hypothesis for the stale reads [HYP-D6].
- The hypothesis could not be verified because queue traces were not retained [HYP-D6].

## Resolution

- A cache invalidation change restored fresh reads [REM-D5].
- Recovery was validated across the EU and US read paths [REM-D5].

## Follow-up actions

- **Open — Data Experience:** Reconcile status-page timing with service logs and document the authoritative duration [ACT-D2].