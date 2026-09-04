# Subscription management clarifications

## Q1: Which account roles may perform each subscription action?

- Category: Authorization, Scope
- Repository evidence: `docs/stakeholder-notes.md` says account owners and billing admins should manage plans and viewers remain read-only, while cancellation authority is explicitly unclear; `src/types.ts` defines only `account_owner`, `billing_admin`, and `viewer` roles.
- Status: Assumption
- Decision: Account owners may change plans, change seats, and cancel; billing admins may change plans and seats but may not cancel; viewers remain read-only.
- Consequence: Both the interface and the mutation boundary must enforce the action matrix, and the owner-only cancellation rule must be confirmed before implementation ships.

## Q2: When do plan, seat, and cancellation changes take effect?

- Category: Billing, Scope
- Repository evidence: `docs/billing-constraints.md` supports immediate upgrades and seat increases plus term-end downgrades and cancellations, while `docs/stakeholder-notes.md` contains a conflicting support expectation for immediate decreases and does not settle seat-decrease timing.
- Status: Assumption
- Decision: Upgrades and seat increases apply immediately with provider-calculated proration; downgrades, seat decreases, and cancellations are scheduled for the renewal date, with no immediate cancellation refund.
- Consequence: Every charged change needs a provider preview before confirmation, and the product must label scheduled changes rather than promise unsupported immediate decreases or refunds.

## Q3: How are pending requests and retries kept from creating conflicts or duplicate charges?

- Category: Billing, Failure
- Repository evidence: `docs/billing-constraints.md` confirms one pending plan-change request per account, asynchronous webhook completion, conflict responses for a second plan-change request, and duplicate-charge risk when retries change the idempotency key; `src/types.ts` already exposes `pendingChange` on the account. Neither source confirms that the same pending-request rule covers seat changes and cancellation.
- Status: Assumption
- Decision: For the first release, an account with any pending subscription work cannot submit another plan, seat, or cancellation change; accepted work stays pending until its final webhook result, and an unknown-outcome retry reuses the original request and idempotency key.
- Consequence: The service must enforce one pending request, preserve retry identity, and keep the interface from presenting an accepted request as already applied.

## Q4: What customer-visible state and recovery are required when billing fails?

- Category: Failure, Scope
- Repository evidence: `docs/stakeholder-notes.md` requires clear pending, rejected, and post-submission failure states; `docs/billing-constraints.md` says provider errors contain internal details that require safe translation, but neither source defines when a failed request may be retried.
- Status: Assumption
- Decision: Rejections leave the subscription unchanged and allow correction; asynchronous failures remain visible with a safe message, and a new attempt is allowed only after reconciliation confirms no charge, applied change, or pending request.
- Consequence: Raw provider errors never reach customer-visible state, and recovery must reconcile the authoritative result before issuing a fresh preview or idempotency key.

## Q5: Which requested-adjacent capabilities are outside the first release?

- Category: Scope, Authorization
- Repository evidence: `docs/stakeholder-notes.md` says an Enterprise approval workflow is unresolved and only asks for a complete first release; `docs/billing-constraints.md` does not support automatic immediate-cancellation refunds, while `src/App.tsx` currently provides only a subscription overview.
- Status: Assumption
- Decision: The first release covers plan changes, positive-integer seat changes, and term-end cancellation; Enterprise approval workflows, cadence changes, payment methods, immediate decreases, automatic refunds, concurrent requests, and support-agent tools are out of scope.
- Consequence: Enterprise accounts use the same role rules until a separate approval policy is confirmed, and implementation tasks must not invent unsupported billing or administration workflows.
