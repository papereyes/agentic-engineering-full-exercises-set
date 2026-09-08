## Timeline

- The public status page recorded an 18-minute degradation window, while service logs recorded elevated stale-read errors for 23 minutes. The five-minute discrepancy remains unresolved. [EVT-D1] [LOG-D4]
- A cache invalidation change was applied, after which fresh reads were restored and validated on EU and US read paths. [REM-D5]

## Impact

- Some EU tenants received stale dashboards. No verified tenant or customer count exists. [IMP-D3]

## Cause and uncertainty

- Delayed invalidation messages may explain the stale reads, but this remains a hypothesis because queue traces were not retained. [HYP-D6]
- The authoritative incident duration is unknown: status-page evidence indicates 18 minutes, while service logs indicate 23 minutes. [EVT-D1] [LOG-D4]

## Resolution

- A cache invalidation change restored fresh reads. This is the final cited recovery signal, validated across EU and US read paths. [REM-D5]

## Follow-up actions

- **Open — Data Experience:** Reconcile status-page timing with service logs and document the authoritative duration. [ACT-D2]