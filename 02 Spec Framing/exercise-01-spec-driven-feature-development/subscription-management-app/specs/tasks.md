# Subscription management implementation tasks

Tasks are ordered by dependency. A task is complete only when its listed verification passes and no protected starter evidence is altered unintentionally.

## TASK-001 Approve policy and freeze the billing contract

Traceability: REQ-001, REQ-002, REQ-003, REQ-004, REQ-006, REQ-008; AC-001, AC-002, AC-004, AC-005, AC-006, AC-011.

- Confirm Q1, Q2, Q4, and Q5 with Product, Finance, Security, and the billing integration owner.
- Document the GET, preview, submit, error, and webhook payloads described in PLAN-001, including preview expiry and the definition of an unknown outcome.
- Identify the trusted server repository/module and its existing authorization, persistence, logging, and provider-client conventions.

Verification: contract examples cover every action/role combination, immediate and renewal timing, stale preview, pending conflict, unknown outcome, and safe error without raw provider data.

## TASK-002 Add server-side authorization, preview, and submission

Depends on: TASK-001.

Traceability: REQ-001, REQ-002, REQ-003, REQ-004, REQ-006, REQ-008; AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-010, AC-011.

- Implement authenticated account loading and the role/action matrix at the trusted mutation boundary.
- Implement provider-backed previews and reject unavailable plans, invalid seats, unchanged values, stale previews, and changed subscription state.
- On confirmation, reauthorize and atomically enforce one pending request per account; bind and persist the request's idempotency key.
- Translate provider responses into the agreed safe codes/messages and persist the audit fields from REQ-008.

Verification: focused server tests prove unauthorized calls never reach the provider, amounts cannot be supplied by the browser, racing submissions produce one provider request, and same-key retries cannot duplicate a charge.

## TASK-003 Add webhook completion and reconciliation

Depends on: TASK-002.

Traceability: REQ-004, REQ-005, REQ-006, REQ-008; AC-007, AC-008, AC-009, AC-011.

- Verify webhook authenticity and reject untrusted events.
- Deduplicate provider event IDs and transition the matching request exactly once to applied or failed.
- Update current or scheduled subscription data only after confirmed success.
- Keep ambiguous failures blocked, add reconciliation using the existing provider lookup capability, and allow a new request only after a safe terminal result.

Verification: tests cover delayed, duplicate, out-of-order, failed, and unrelated events plus timeout recovery; audit entries and subscription state remain correct after repeated delivery.

## TASK-004 Type the API and extend the existing client service

Depends on: TASK-001.

Traceability: REQ-002, REQ-003, REQ-004, REQ-005, REQ-006; AC-004, AC-005, AC-006, AC-007, AC-008, AC-010, AC-011.

- Add the agreed permission, proposal, preview, request-status, price, and safe-error types to `src/types.ts`.
- Add load, preview, and submit functions to `src/services/subscriptionService.ts` using native `fetch`.
- Create one idempotency key per confirmation and retain it across retries while the result is unknown.
- Convert non-success API responses to typed safe errors without exposing raw response bodies to the screen.

Verification: typecheck passes and service-level tests cover successful payloads, every safe error code, network timeout with retained identity, and malformed responses.

## TASK-005 Build the accessible account-management flow

Depends on: TASK-004; integration completion also requires TASK-002 and TASK-003.

Traceability: REQ-001, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007; AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-010, AC-012.

- Update `src/App.tsx` to render actions from authoritative permissions and a single labeled native form for plan, seats, or cancellation.
- Show provider preview details in an explicit confirmation step; require explicit cancellation confirmation.
- Prevent repeat confirmation while submitting. Show pending, safe rejection, failed/reconciliation-required, and applied/scheduled states from server data.
- Move focus to confirmation or the error summary and announce status changes. Add minimal supporting rules to `src/styles.css` with visible focus and non-color status cues.

Verification: UI tests exercise every listed acceptance criterion at keyboard-only and narrow viewport sizes; direct server tests remain the proof of authorization.

## TASK-006 Run end-to-end billing scenarios and release checks

Depends on: TASK-002, TASK-003, TASK-004, TASK-005.

Traceability: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008; AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009, AC-010, AC-011, AC-012.

- Run repository lint, typecheck, tests, and production build.
- In the provider sandbox, execute an immediate charged increase, scheduled decrease, cancellation, rejection, timeout retry, delayed webhook, and duplicate webhook.
- Confirm audit records, customer-safe errors, pending-age monitoring, webhook-failure monitoring, and refresh/reload behavior.
- Record Product/Security/Finance approval of assumed policies before enabling production access.

Verification: all AC-001 through AC-012 pass with captured request IDs and no duplicate charge, raw provider error, unauthorized mutation, or premature subscription update.
