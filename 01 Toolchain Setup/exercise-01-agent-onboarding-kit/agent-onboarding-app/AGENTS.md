# Agent guide

Work only in this app unless the exercise README explicitly requires evidence beside it. Treat the README, `lab-contract.json`, fixtures, verification scripts, and integrity manifests as protected inputs; fix product code instead of weakening checks.

## Start safely

1. Use Node 22.12–24 and install the lockfile with `npm ci`.
2. Read `package.json`, the relevant `src/` files, and [support notes](docs/support-notes.md) before editing.
3. Run `npm run agent:check` after changes. Run the task-specific verifier when one exists, then `npm run verify:exercise` only for the final submission.

## Source map and rules

- `src/data/` owns sample data and policy values. Do not duplicate policy constants elsewhere.
- `src/services/caseRouter.ts` owns reusable routing decisions, risk calculation, and triage ordering. Pass the active policy into behavior that depends on it.
- `src/App.tsx` owns presentation and filter state. Derive displayed items, their count, and their ordering from one visible list so the UI cannot disagree with itself.
- `src/types.ts` owns shared domain types; preserve existing status and routing behavior unless the task explicitly changes them.

Keep the diff focused. Reuse the service boundary instead of reimplementing business rules in the component. Preserve existing filters and verify boundary values with the supplied task check.
