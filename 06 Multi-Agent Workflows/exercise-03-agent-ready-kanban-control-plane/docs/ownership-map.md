# Ownership Map

There are no active reservations after integration.

| Card | Requested paths retained for history | Active reservation | Reason |
|---|---|---|---|
| ESC-118 | `src/services/workflowApi.ts` | none | Needs `REPRO-118` before assignment |
| ESC-120 | scoring, SeverityBadge, and ESC-120 tests | none | Lane merged and ownership released |
| ESC-122 | scoring and SeverityBadge | none | Still blocked by `RULE-ESC-122` |
| ESC-121 | `src/services/exportApi.ts` | none | Card remains cancelled |

The requested-path history remains auditable, but no waiting, blocked, merged, or cancelled card owns a path. A future ESC-122 lane requires an approved rule and a new collision check.
