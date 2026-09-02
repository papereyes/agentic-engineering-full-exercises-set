# INC-2047 implementation handoff

Focus: complete and verify the automatic escalation incident fix.

Prepared: 2026-09-02 (Asia/Kolkata). This is a context handoff, not an implementation. Repository files were not intentionally changed.

## Verified current facts

- `incidents/INC-2047.md` limits the incident to automatic escalation policy and workflow API integration. Manual actions, filtering, risk scoring, and public API names must stay compatible.
- `docs/current-sla-policy.md` is the approved authority (version 3.1, effective 2026-07-01). Eligibility is High priority, waiting time at least 48 hours, not already escalated, and not manually escalated.
- The only automatic changes allowed by that policy are `status: "Escalated"` and `escalationMode: "automatic"`. Owner and all other case content must remain intact. Existing manual and automatic escalations must remain unchanged on reruns.
- `docs/workflow-api-contract.md` says `runAutomaticEscalation()` must save the resulting queue and return a copy. A later `fetchWorkItems()` must return the same saved state. Public exports must retain their names, and callers must not receive mutable internal references.
- The supplied implementation still violates those rules. In `src/services/escalationPolicy.ts`, the threshold constant is wrong and automatic escalation overwrites `owner`. In `src/services/workflowApi.ts`, `runAutomaticEscalation()` computes a local array but never assigns it to `storedItems`.
- `src/data/workItems.ts` and `scripts/run-incident-tests.mjs` establish that the eligible automatic IDs are `INC-2047-A` and `INC-2047-E`; the below-boundary case remains queued, the manual case remains untouched, and saved totals show three escalated items afterward.
- `src/utils/scoring.ts` is compatible with the expected totals and is outside the incident fix. `src/types.ts` already has the needed types. No type or scoring change is indicated.
- `package.json` now maps `npm test` to the incident suite. Prefer the explicit command below for unambiguous evidence.

## Stale or unsupported claims — reject

Historical threshold: 24 hours.

Historical ownership destination: Incident Desk.

Those ideas come from the superseded draft at `docs/sla-rollout-proposal.md`. They were repeated in `docs/raw-session-history.md`, `docs/previous-agent-progress.md`, and `docs/abandoned-fix.patch`; none establishes production behavior. Do not apply the abandoned patch. The prior “Complete” status is contradicted by source inspection and `docs/failed-test-output.txt`.

The archived output records three incident failures and one incident pass. Its trailing evidence-export `EACCES` message is explicitly unrelated and must not distract from the policy and persistence failures.

## Remaining implementation

1. Make the smallest policy correction in `src/services/escalationPolicy.ts`: align the constant with the approved boundary and stop changing ownership. Preserve the existing spread-based item copy and eligibility guards.
2. In `src/services/workflowApi.ts`, save the transformed queue into `storedItems` before returning cloned items. Keep `fetchWorkItems()`, `saveAction()`, `collectEvidence()`, and cloning behavior compatible with `docs/workflow-api-contract.md`.
3. Do not edit risk scoring, fixtures, public export names, or manual escalation behavior. No new dependency or abstraction is needed.

## Verification boundary and commands

- Fresh attempt on 2026-09-02: `npm run test:incident` exited 1 before loading tests because package `vite` is absent in this checkout. This proves only that this environment lacks installed dependencies; it is not an implementation result. Do not change manifests to work around it.
- In an environment with the declared dependencies installed, run `npm run test:incident` and require all 10 incident checks to pass.
- Then run `npm run typecheck` and `npm run agent:check`. Review `git diff -- src/services/escalationPolicy.ts src/services/workflowApi.ts` to confirm the fix is limited to the two intended services.
- Treat a returned-array assertion alone as insufficient: the incident suite's later-fetch and totals checks are the persistence proof.

## Source map

- Authority: `docs/current-sla-policy.md`, `docs/workflow-api-contract.md`, `incidents/INC-2047.md`.
- Executable expectations: `scripts/run-incident-tests.mjs`, `package.json`.
- Implementation and fixtures: `src/services/escalationPolicy.ts`, `src/services/workflowApi.ts`, `src/types.ts`, `src/data/workItems.ts`, `src/utils/scoring.ts`.
- Historical audit only: `docs/raw-session-history.md`, `docs/sla-rollout-proposal.md`, `docs/previous-agent-progress.md`, `docs/failed-test-output.txt`, `docs/abandoned-fix.patch`.

## Suggested skills

Call the Skill tool for `systematic-debugging`, then `test-driven-development`, `ponytail`, and `verification-before-completion`. These keep the next session focused on root cause, the existing incident check, the minimum two-file correction, and evidence-backed completion.
