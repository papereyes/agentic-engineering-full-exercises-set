# Graph Query Evidence

Graphify queries were completed before opening or reading application source files. Query terms were constrained to vocabulary extracted from `graphify-out/graph.json`; `credits` was absent and was not invented as a query token.

## GQ-01: Formula and account resolution

Commands:

```text
rtk graphify query "recognized revenue formula tenant resolve billing account" --budget 3000
rtk graphify path "recognizedRevenueByAccount()" "resolveBillingAccountId()"
rtk graphify explain "recognizedRevenueByAccount()"
rtk graphify explain "resolveBillingAccountId()"
```

Relevant output:

```text
recognizedRevenueByAccount() --calls [EXTRACTED]--> resolveBillingAccountId()
recognizedRevenueByAccount(): billing-graph-app/src/billing/recognizedRevenue.ts L8
resolveBillingAccountId(): billing-graph-app/src/billing/tenantAccountDirectory.ts L3
```

Answer: `recognizedRevenueByAccount()` owns the recognized-revenue calculation. It calls `resolveBillingAccountId()` to resolve each event's tenant to its billing account.

Confidence: `EXTRACTED` AST call and containment edges.

## GQ-02: Dashboard path

Commands:

```text
rtk graphify query "dashboard recognized revenue calculation path" --dfs --budget 3000
rtk graphify path "loadRevenueDashboard()" "recognizedRevenueByAccount()"
```

Relevant output:

```text
Shortest path (2 hops):
loadRevenueDashboard() --calls [EXTRACTED]--> buildRevenueSummary()
buildRevenueSummary() --calls [EXTRACTED]--> recognizedRevenueByAccount()
```

Answer: the dashboard reaches recognized revenue through the shared `buildRevenueSummary()` function.

Confidence: both call edges are `EXTRACTED`.

## GQ-03: Scheduled snapshot path

Commands:

```text
rtk graphify query "snapshot recognized revenue calculation path" --dfs --budget 3000
rtk graphify path "publishRevenueSnapshot()" "recognizedRevenueByAccount()"
```

Relevant output:

```text
Shortest path (2 hops):
publishRevenueSnapshot() --calls [EXTRACTED]--> buildRevenueSummary()
buildRevenueSummary() --calls [EXTRACTED]--> recognizedRevenueByAccount()
```

Answer: the scheduled snapshot uses the same shared summary and recognized-revenue function as the dashboard.

Confidence: both call edges are `EXTRACTED`.

## GQ-04: Current and stale rules

Commands:

```text
rtk graphify query "refund grouping missing mapping rules source stale superseded" --budget 3000
rtk graphify query "refund grouping mapping stale superseded" --budget 3000
rtk graphify explain "Recognized Revenue Contract"
rtk graphify explain "Legacy Finance Metrics"
rtk graphify explain "Charge Revenue Rule"
rtk graphify explain "Refund Revenue Rule"
rtk graphify explain "Billing Account Grouping"
rtk graphify explain "Missing Mapping Error"
rtk graphify path "Recognized Revenue Contract" "Legacy Finance Metrics" --undirected
```

Relevant output:

```text
Recognized Revenue Contract: docs/current-metric-contract.md lines 1-7
  --> Charge Revenue Rule [references] [EXTRACTED] line 9
  --> Refund Revenue Rule [references] [EXTRACTED] line 10
  --> Billing Account Grouping [references] [EXTRACTED] line 11
  --> Tenant-to-Account Resolution [references] [EXTRACTED] line 12
  --> Missing Mapping Error [references] [EXTRACTED] line 13
Legacy Finance Metrics: docs/legacy-finance-metrics.md lines 1-4
Superseded Rules Warning --rationale_for [EXTRACTED]--> Legacy Finance Metrics
Stale Extract Warning --rationale_for [EXTRACTED]--> Historical Graph Extract
```

Answer: `docs/current-metric-contract.md` defines credits, refunds, billing-account grouping, tenant resolution, and missing-mapping behavior. `docs/legacy-finance-metrics.md` is superseded, and `docs/graph-extract.md` is stale.

Confidence and source verification: rule and warning edges are `EXTRACTED`. The undirected legacy-grouping bridge contained an `INFERRED` edge and was source verified: the current contract confirms charge minus credits, negative refunds, account grouping, and mapping errors; the legacy document confirms its tenant-based positive-gross rules are superseded. The `AMBIGUOUS` historical extract was source verified as stale and was excluded.

## GQ-05: Ownership boundary

Commands:

```text
rtk graphify query "ownership calculation consumer" --budget 3000
rtk graphify path "Billing Service Ownership" "Support Analytics"
rtk graphify explain "Billing Service Ownership"
rtk graphify explain "Consumer Ownership Boundary"
```

Relevant output:

```text
Billing Service Ownership --> Billing Platform [conceptually_related_to] [EXTRACTED]
Billing Service Ownership --> Support Analytics [conceptually_related_to] [EXTRACTED]
Consumer Ownership Boundary --rationale_for [EXTRACTED]--> Billing Service Ownership
Support Analytics Calculation Ownership Claim --conceptually_related_to [AMBIGUOUS]--> Consumer Ownership Boundary
```

Answer: Billing Platform owns the recognized-revenue calculation and tenant-to-account directory. Support Analytics consumes the dashboard summary; Finance Operations consumes the scheduled snapshot summary.

Confidence and source verification: the ownership relationships and consumer-boundary rationale are `EXTRACTED`. The contrary `AMBIGUOUS` historical ownership claim was source verified against `docs/service-ownership.md`, which assigns formula ownership to Billing Platform and consumer status to Support Analytics and Finance Operations.

## GQ-06: Preserved metric

Commands:

```text
rtk graphify query "unrelated metric gross volume" --budget 3000
rtk graphify explain "Gross Volume Invariant"
rtk graphify path "Gross Volume Invariant" "grossVolumeByAccount()" --undirected
```

Relevant output:

```text
Gross Volume Invariant: docs/current-metric-contract.md line 14
rationale: Recognized-revenue corrections must not change gross volume, which remains the sum of gross amounts.
No path found between 'Gross Volume Invariant' and 'grossVolumeByAccount()'.
```

Answer: `grossVolumeByAccount()` behavior must remain unchanged; gross volume remains the sum of gross amounts.

Confidence: the contract rationale is `EXTRACTED`. The graph had no path from the documentation rationale to the code symbol, so source inspection and the existing gross-volume regression check were used rather than inventing an edge.
