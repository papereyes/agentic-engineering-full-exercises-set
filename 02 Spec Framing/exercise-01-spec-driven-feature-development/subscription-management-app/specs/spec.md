# Subscription management specification

## Objective

Let authorized users change plans and seat counts or schedule cancellation without support intervention, while preventing unauthorized actions, conflicting requests, duplicate charges, and exposure of billing-provider details.

This specification uses the decisions in `specs/clarifications.md`. Decisions marked there as assumptions are release-blocking policy assumptions that must be confirmed before production launch; they are explicit here so implementation can proceed without silently inventing behavior.

## Evidence and current state

- `src/App.tsx` renders read-only account cards from local data.
- `src/types.ts` defines `account_owner`, `billing_admin`, and `viewer`, plus a free-text `pendingChange`.
- `src/services/subscriptionService.ts` contains only display helpers; no mutation or billing API exists in this repository.
- `docs/billing-constraints.md` confirms preview support, immediate increases, term-end decreases and cancellation, one pending request, asynchronous completion, idempotency requirements, and unsafe provider error details.

## Scope

In scope for the first release:

- View the current plan, seats, cadence, renewal date, and any pending or failed change.
- Change to another available plan.
- Change seats to a positive integer.
- Schedule cancellation for the current renewal date.
- Preview price impact, confirm a change, track an accepted request, and recover safely from rejection or asynchronous failure.

Not in scope: billing-cadence changes, payment-method management, automatic refunds, immediate downgrades, immediate seat decreases, immediate cancellation, concurrent requests, support-agent tooling, and Enterprise-specific approvals. Enterprise accounts follow the same role matrix until a separate approval policy is approved.

## Policy assumptions

| Topic | First-release decision | Source |
| --- | --- | --- |
| Cancellation permission | Only `account_owner` may cancel. | Q1 |
| Timing | Upgrades and seat increases apply immediately; downgrades, seat decreases, and cancellations apply at renewal. | Q2 |
| Pending-request scope | One pending plan, seat, or cancellation request blocks every new subscription change. | Q3 |
| Recovery | A fresh attempt is allowed only after reconciliation proves that no charge, applied change, or request remains pending. | Q4 |
| Enterprise | No separate approval flow. | Q5 |

## Domain model and states

A change request contains: stable request ID, account ID, action (`plan_change`, `seat_change`, or `cancel`), requested value when applicable, effect timing (`immediate` or `renewal`), provider preview ID, idempotency key, safe price summary, status, timestamps, and a safe customer message when failed.

Request status is one of:

- `pending`: the provider accepted the request but its webhook outcome is not final.
- `applied`: the webhook confirms an immediate change was applied or a renewal-date change was scheduled.
- `failed`: submission or later processing failed and reconciliation is required before another attempt.

A preview is not a change request and does not alter the subscription. A synchronous rejection leaves the subscription unchanged and creates no pending request. The server is authoritative for account role, subscription values, pending state, price preview, and final provider result.

## Requirements

### REQ-001 Authorization

The server-side mutation boundary shall permit account owners to change plan, change seats, and cancel; permit billing admins to change plan and seats but not cancel; and reject all viewer mutations. The interface shall hide or disable unavailable actions, but interface state is not an authorization control.

### REQ-002 Supported changes and effective timing

The workflow shall accept only an available target plan, a positive-integer seat count different from the current count, or cancellation. The server shall classify upgrades and seat increases as immediate with provider-calculated proration. It shall classify downgrades, seat decreases, and cancellation as scheduled for the account renewal date without promising an immediate refund.

### REQ-003 Preview and confirmation

Every proposed change shall receive a fresh provider preview before confirmation. The confirmation view shall show the action, current and requested values, whether it is immediate or scheduled, the effective date, currency, and provider-calculated amount due now or the next-renewal price impact. Confirmation shall submit the preview identifier rather than trusting amounts supplied by the browser. If the subscription or preview expires before submission, the server shall reject it and require a new preview.

### REQ-004 Submission safety and pending conflicts

The server shall accept at most one pending change per account. Submission shall use one stable idempotency key per user confirmation and reuse that key while the outcome is unknown. Controls for another change shall be unavailable while work is pending, and the server shall return a conflict for racing or stale second submissions.

### REQ-005 Asynchronous completion

Provider acceptance shall display as pending, not applied. A verified, duplicate-safe webhook shall transition the request to `applied` or `failed`; only an applied result may update the displayed plan, seats, or scheduled cancellation. Refreshing or reopening the page shall load the authoritative current request state.

### REQ-006 Failure handling and recovery

Provider errors shall be mapped to safe customer messages and logged with internal correlation details outside customer-visible state. Validation or provider rejection shall preserve the current subscription and let the user correct the proposal. An asynchronous failure shall remain visible and block a fresh request until server-side reconciliation establishes a safe terminal state. A retry made while the original result is unknown shall reuse the original request and idempotency key.

### REQ-007 User experience and accessibility

The management form shall use labeled native controls, expose validation and request status to assistive technology, move focus to the confirmation or error summary after an action, and keep status understandable without color alone. Destructive cancellation shall require an explicit confirmation step. Loading shall prevent repeat submission without removing the current subscription context.

### REQ-008 Auditability

The trusted service shall record actor identity and role, account, action, old and requested values, preview ID, idempotency key, request status changes, provider correlation ID, and timestamps. Customer-visible data shall not include raw provider errors or secret billing data.

## Acceptance criteria

### AC-001 Viewer remains read-only

Given a viewer opens an account, When the subscription screen loads or the viewer sends a mutation directly, Then management actions are unavailable and the server rejects the mutation without creating a preview, request, or charge.

### AC-002 Billing admin cannot cancel

Given a billing admin can manage plan and seats, When the screen loads or the admin sends a cancellation directly, Then cancellation is unavailable in the interface and rejected by the server while plan and seat actions remain available.

### AC-003 Account owner can choose supported actions

Given an account owner with no pending request, When the owner opens management, Then plan change, positive-integer seat change, and term-end cancellation actions are available with current subscription context.

### AC-004 Immediate charged change is previewed

Given an authorized user proposes an upgrade or seat increase, When the provider preview succeeds, Then confirmation shows the provider-calculated currency and amount due now, identifies proration, and states that the change takes effect immediately.

### AC-005 Decrease or cancellation is scheduled

Given an authorized user proposes a downgrade, seat decrease, or permitted cancellation, When the provider preview succeeds, Then confirmation states that the current subscription continues through the displayed renewal date and shows the next-renewal price impact without promising an immediate refund.

### AC-006 Invalid or stale input cannot be submitted

Given a missing target, unavailable plan, non-integer or non-positive seat count, unchanged value, expired preview, or subscription changed after preview, When confirmation is attempted, Then the server rejects the request, leaves the subscription unchanged, and directs the user to correct the input or obtain a fresh preview.

### AC-007 Pending work prevents a conflict

Given an account already has a pending request, When any user opens management or attempts another submission, Then the pending action and status are shown, new change controls are unavailable, and a direct second submission receives a conflict without a provider mutation.

### AC-008 Accepted work remains pending until webhook completion

Given the provider accepts a confirmed change without a final result, When the response is displayed or the page is refreshed, Then the request is shown as pending and current subscription values are not presented as changed.

### AC-009 Successful webhook finalizes the result once

Given a pending request, When a valid success webhook is received one or more times, Then the request becomes applied exactly once, the current or scheduled subscription state reflects the result, and the audit history records the transition.

### AC-010 Safe rejection and correction

Given preview or submission is rejected, When the failure is shown, Then the current subscription remains unchanged, the user sees a safe actionable message with no raw provider detail, and may correct the proposal and request a new preview.

### AC-011 Unknown outcome does not duplicate a charge

Given submission times out or an asynchronous request fails without a reconciled outcome, When the user retries or attempts a new change, Then the system either reuses the original request and idempotency key or blocks the new attempt until reconciliation confirms it is safe.

### AC-012 Accessible cancellation confirmation

Given an account owner selects cancellation, When the owner proceeds, Then a labeled confirmation identifies the renewal-date effect and retained access, keyboard focus reaches that confirmation, and no cancellation is submitted until the owner explicitly confirms.

## Release conditions

- Product confirms the assumptions in Q1 through Q5.
- The server API and webhook handler satisfy the trusted-boundary requirements; a browser-only implementation is not releasable.
- Automated checks cover the role matrix, timing classification, preview integrity, pending conflict, idempotent retry, duplicate webhook, safe error mapping, and the acceptance flows above.
