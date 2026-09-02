# Subscription management technical plan

## Approach

Keep the existing React application and native browser controls. Extend the current account model and `subscriptionService` client rather than introducing state-management, form, or component libraries. Billing mutations must use an existing trusted server deployment because this repository contains no server runtime and provider credentials, authorization, idempotency, and webhooks cannot safely live in the browser.

The minimal HTTP contract is:

- `GET /api/accounts/:accountId/subscription` returns the authoritative subscription, caller permissions, available plans, and current request.
- `POST /api/accounts/:accountId/subscription/preview` accepts only the action and requested value, then returns a provider-backed preview ID, effect timing/date, currency, price impact, and expiry.
- `POST /api/accounts/:accountId/subscription/changes` accepts the preview ID and an `Idempotency-Key` header, authorizes again, rejects stale previews or pending conflicts, and returns the request state.
- The existing billing integration consumes verified webhooks, deduplicates provider event IDs, reconciles the request, and exposes the resulting state through the GET endpoint.

The API uses safe error codes (`forbidden`, `invalid_change`, `preview_expired`, `pending_conflict`, `provider_unavailable`, `reconciliation_required`) plus customer-safe messages. Raw provider payloads stay server-side.

## Delivery sequence

### PLAN-001 Confirm policy and API contract

Requirements: REQ-001, REQ-002, REQ-003, REQ-004, REQ-006, REQ-008.

- Obtain approval for the assumptions recorded in Q1, Q2, Q4, and Q5 before production release.
- Agree the three HTTP payloads, stable error codes, preview expiry behavior, idempotency ownership, and webhook event identifiers with the existing billing integration owner.
- Define the server transaction/constraint that enforces one pending request per account and the audit fields in REQ-008.
- Do not add a server framework to this frontend repository; server changes belong beside the existing billing integration.

### PLAN-002 Extend domain types and the existing service seam

Requirements: REQ-002, REQ-003, REQ-004, REQ-005, REQ-006.

- In `src/types.ts`, replace free-text pending state with typed action, preview, permissions, request status, price impact, and safe error shapes while preserving current account display fields.
- In `src/services/subscriptionService.ts`, retain the display helpers and add small `fetch` functions for load, preview, and submit. Generate one idempotency key when confirmation begins and retain it for retries of that confirmation.
- Map HTTP status/error codes to typed outcomes; never return raw provider response text to UI components.
- Keep effect-timing and authorization decisions server-authored. The client may render them but must not calculate or override them.

### PLAN-003 Build the management flow in the current screen

Requirements: REQ-001, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007.

- In `src/App.tsx`, load authoritative account data, render actions from server permissions, and use a single native form for plan, seats, or cancellation.
- Validate basic presence and positive-integer seat input before preview; treat server validation as authoritative.
- Render a separate confirmation state from the returned preview. Disable confirmation during submission, show pending state after acceptance, and refresh authoritative state after completion or page reload.
- For pending or reconciliation-required accounts, show the request summary and status instead of mutation controls.
- Add only the styles needed for form layout, focus visibility, status/error presentation, and destructive confirmation in `src/styles.css`.

### PLAN-004 Implement trusted billing orchestration

Requirements: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-008.

- At the existing server billing boundary, authorize from the authenticated account membership on every preview and submission.
- Ask the provider for the preview, persist its opaque identifier and expiry, and verify the account/current state again during submission.
- Atomically create no more than one pending request per account and bind the stable idempotency key to that request. Reuse it until the outcome is known.
- Translate provider rejections to safe errors. On ambiguous results, retain a reconciliation-required failure that blocks fresh work.
- Verify webhook authenticity, deduplicate event IDs, reconcile against the stored request, update subscription/request state exactly once, and append audit transitions.

### PLAN-005 Verify behavior and rollout safety

Requirements: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008.

- Add focused service tests for the role matrix, timing, preview expiry/state mismatch, concurrent pending requests, same-key retry, ambiguous outcomes, safe errors, and duplicate webhooks.
- Add UI tests for all role states, immediate and scheduled previews, validation, repeat-click protection, pending reload, safe failure, focus movement, and cancellation confirmation.
- Run the repository typecheck, lint, build, and tests. Exercise provider sandbox flows for one immediate charge, one scheduled change, rejection, delayed webhook, duplicate webhook, and retry after timeout.
- Release behind the existing deployment control if one exists; do not create a feature-flag system solely for this feature. Monitor provider errors, pending age, duplicate attempts, and webhook processing failures.

## Data and concurrency rules

- Money is transported as provider-formatted display text plus integer minor units and ISO currency; the browser does not perform billing arithmetic.
- Dates are ISO calendar dates from the server and displayed with the account's established locale/time-zone policy.
- The pending-account constraint and idempotency record are atomic at the trusted storage layer, not an in-memory or client-side check.
- Webhook processing is idempotent by provider event ID and request ID. Out-of-order or unrelated events are logged for reconciliation and do not overwrite a terminal result.

## Verification mapping

| Area | Acceptance coverage |
| --- | --- |
| Roles and supported actions | AC-001, AC-002, AC-003 |
| Preview, timing, and validation | AC-004, AC-005, AC-006 |
| Pending and asynchronous completion | AC-007, AC-008, AC-009 |
| Failure, retry, and accessibility | AC-010, AC-011, AC-012 |

