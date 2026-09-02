# Graph Audit

## Current Sources Retained

| Rule or ownership fact | Source path and line | Graph node or edge |
|---|---|---|
| Charges subtract credits; refunds subtract gross | `docs/current-metric-contract.md:9-10` | `Recognized Revenue Contract` references extracted charge and refund rule nodes |
| Group by billing account and reject missing mappings | `docs/current-metric-contract.md:11-13` | Extracted grouping, resolution, and missing-mapping nodes |
| Gross volume is unchanged; both consumers share one summary | `docs/current-metric-contract.md:14-15` | Extracted `Gross Volume Invariant` and `Shared Revenue Summary` rationale edges |
| Billing Platform owns the formula and account directory | `docs/service-ownership.md:7-8` | Extracted ownership relationship |
| Support Analytics and Finance Operations consume the summary | `docs/service-ownership.md:9-12` | Extracted consumer relationships and boundary rationale |
| Both consumers call the shared calculation | `billing-graph-app/src/dashboard/loadRevenueDashboard.ts:7`; `billing-graph-app/src/jobs/publishRevenueSnapshot.ts:7`; `billing-graph-app/src/billing/revenueSummary.ts:7` | Extracted call paths through `buildRevenueSummary()` |

## Stale or Unsupported Claims Excluded

| Claim | Source | Current evidence that rejects it |
|---|---|---|
| Positive gross revenue grouped by tenant | `docs/legacy-finance-metrics.md:6` | The source marks its rules superseded at line 10; the current contract requires net account totals. |
| Support Analytics owns calculation changes | `docs/legacy-finance-metrics.md:8` | `docs/service-ownership.md:7-12` assigns calculation ownership to Billing Platform and consumer status to Support Analytics. |
| Snapshot owns a separate formula | `docs/graph-extract.md:9` | The extract is stale (`:3,13`); the extracted code path routes the snapshot through the shared summary. |
| Historical graph has no account directory | `docs/previous-agent-progress.md:8` | The extracted code graph contains `resolveBillingAccountId()` in `tenantAccountDirectory.ts`. |

## Graph-First Boundary

The first graph command was `rtk graphify reflect --if-stale`; the first incident traversal was `rtk graphify query "dashboard recognized revenue calculation path" --dfs --budget 3000`. The implementation agent queried the graph with `query`, `path`, and `explain` before opening or reading application source. Only after answering GQ-01 through GQ-06 did it inspect the cited source files and verify inferred or ambiguous edges. The previous implementation and baseline patch were not shared.

Graph health diagnosis reported 15 dangling semantic edges. They did not affect the extracted code call paths or the cited current-rule nodes used for the change, but the warning is retained here rather than hidden.
