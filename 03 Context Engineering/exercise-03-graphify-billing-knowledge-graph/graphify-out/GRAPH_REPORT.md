# Graph Report - exercise-03-graphify-billing-knowledge-graph  (2026-09-02)

## Corpus Check
- Corpus is ~4,831 words - fits in a single context window. You may not need a graph.

## Summary
- 168 nodes · 220 edges · 14 communities (11 shown, 2 thin omitted)
- Extraction: 93% EXTRACTED · 5% INFERRED · 2% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Billing Rules and Ownership
- Exercise UI Evidence
- TypeScript Configuration
- Package Dependencies
- Project Scripts
- Revenue Calculation Flow
- Stale Billing Claims
- Graph Evidence Verifier
- Formatting Verification
- Agent Contract Verification
- Billing Regression Tests
- Web Entry Point
- Lint Verification

## God Nodes (most connected - your core abstractions)
1. `scripts` - 17 edges
2. `compilerOptions` - 16 edges
3. `Recognized Revenue Contract` - 10 edges
4. `TenantAccountLink` - 7 edges
5. `buildRevenueSummary()` - 7 edges
6. `BillingEvent` - 6 edges
7. `LabContract` - 6 edges
8. `Historical Graph Extract` - 6 edges
9. `App()` - 5 edges
10. `resolveBillingAccountId()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Billing Incident Request` --semantically_similar_to--> `REV-482 Recognized Revenue Mismatch`  [INFERRED] [semantically similar]
  README.md → billing-graph-app/incidents/REV-482.md
- `First Attempt Only` --semantically_similar_to--> `First-Attempt Comparison`  [INFERRED] [semantically similar]
  docs/evidence-template.md → README.md
- `Shared Calculation Scope` --semantically_similar_to--> `Shared Revenue Summary`  [INFERRED] [semantically similar]
  billing-graph-app/incidents/REV-482.md → docs/current-metric-contract.md
- `Reported Revenue Failures` --conceptually_related_to--> `Recognized Revenue Contract`  [INFERRED]
  billing-graph-app/incidents/REV-482.md → docs/current-metric-contract.md
- `Graphify Billing Knowledge Graph Exercise` --references--> `Graph-First Billing Evidence Template`  [EXTRACTED]
  README.md → docs/evidence-template.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Current Recognized Revenue Governance** — docs_current_metric_contract_recognized_revenue_contract, docs_service_ownership_billing_platform, billing_graph_app_incidents_rev_482_rev_482 [INFERRED 0.85]
- **Shared Revenue Consumer Flow** — docs_current_metric_contract_shared_revenue_summary, docs_service_ownership_support_analytics, docs_service_ownership_finance_operations [EXTRACTED 1.00]
- **Stale Billing Context Chain** — docs_legacy_finance_metrics_legacy_finance_metrics, docs_graph_extract_historical_graph_extract, docs_previous_agent_progress_incorrect_completion [INFERRED 0.85]

## Communities (14 total, 2 thin omitted)

### Community 0 - "Billing Rules and Ownership"
Cohesion: 0.11
Nodes (23): Reported Revenue Failures, REV-482 Recognized Revenue Mismatch, Shared Calculation Scope, Charge Revenue Rule, Gross Volume Invariant, Missing Mapping Error, Recognized Revenue Contract, Refund Revenue Rule (+15 more)

### Community 1 - "Exercise UI Evidence"
Cohesion: 0.18
Nodes (15): App(), DecisionLog(), EvidenceLedger(), SkillPatternBoard(), labContract, root, evidenceStatus(), readinessScore() (+7 more)

### Community 2 - "TypeScript Configuration"
Cohesion: 0.09
Nodes (22): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+14 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, react, react-dom, devDependencies, @types/react, @types/react-dom, typescript, vite (+12 more)

### Community 4 - "Project Scripts"
Cohesion: 0.12
Nodes (17): scripts, agent:check, build, dev, format, lint, preview, test (+9 more)

### Community 5 - "Revenue Calculation Flow"
Cohesion: 0.38
Nodes (9): BillingEvent, RevenueSummary, TenantAccountLink, grossVolumeByAccount(), recognizedRevenueByAccount(), buildRevenueSummary(), resolveBillingAccountId(), loadRevenueDashboard() (+1 more)

### Community 6 - "Stale Billing Claims"
Cohesion: 0.18
Nodes (12): Billing Account Grouping, Dashboard Tenant Grouping Claim, Historical Graph Extract, Snapshot Formula Ownership Claim, Stale Extract Warning, Support Analytics Calculation Ownership Claim, Legacy Finance Metrics, Positive Gross Revenue by Tenant (+4 more)

### Community 7 - "Graph Evidence Verifier"
Cohesion: 0.22
Nodes (8): appRoot, evidence, evidencePaths, exerciseRoot, failures, readRequired(), sha256(), verifyStarterIntegrity()

### Community 8 - "Formatting Verification"
Cohesion: 0.33
Nodes (5): failures, files, missingSections, readme, requiredSections

### Community 9 - "Agent Contract Verification"
Cohesion: 0.40
Nodes (4): contract, docsDir, failures, root

### Community 11 - "Web Entry Point"
Cohesion: 0.67
Nodes (3): Billing Application HTML Shell, Main TSX Module, Application Root Mount

## Ambiguous Edges - Review These
- `Historical Graph Extract` → `Dashboard Tenant Grouping Claim`  [AMBIGUOUS]
  docs/graph-extract.md · relation: references
- `Historical Graph Extract` → `Snapshot Formula Ownership Claim`  [AMBIGUOUS]
  docs/graph-extract.md · relation: references
- `Historical Graph Extract` → `Support Analytics Calculation Ownership Claim`  [AMBIGUOUS]
  docs/graph-extract.md · relation: references
- `Support Analytics Calculation Ownership Claim` → `Consumer Ownership Boundary`  [AMBIGUOUS]
  docs/graph-extract.md · relation: conceptually_related_to

## Knowledge Gaps
- **75 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 83 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Historical Graph Extract` and `Dashboard Tenant Grouping Claim`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Historical Graph Extract` and `Snapshot Formula Ownership Claim`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Historical Graph Extract` and `Support Analytics Calculation Ownership Claim`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Support Analytics Calculation Ownership Claim` and `Consumer Ownership Boundary`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `scripts` connect `Project Scripts` to `Package Dependencies`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `Recognized Revenue Contract` connect `Billing Rules and Ownership` to `Stale Billing Claims`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Recognized Revenue Contract` (e.g. with `Reported Revenue Failures` and `Safe Billing Edit Path Questions`) actually correct?**
  _`Recognized Revenue Contract` has 3 INFERRED edges - model-reasoned connections that need verification._