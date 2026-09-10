# Legacy Brief Contradictions

## BRIEF-01

Claim: The checkout application calls an external gateway service directly.

Result: rejected.

Source: `payment-workflow-app/src/App.tsx:6` calls `runPaymentScenario` (VIS-01), while `paymentOrchestrator.ts:27` calls `authorizePayment` through the adapter (VIS-02).

Diagram decision: Show `CheckoutUI --> Orchestrator --> GatewayAdapter`; omit a direct checkout-to-gateway edge.

## BRIEF-02

Claim: A declined authorization is retried once before the order fails.

Result: rejected.

Source: `payment-workflow-app/src/payment/paymentOrchestrator.ts:36-57` immediately builds the failed intent, order, ledger entry, and blocked receipt, then returns; payment tests confirm the declined result without retry.

Diagram decision: Show the authorization-declined branch ending in failure records, with no retry transition or message.

## BRIEF-03

Claim: Any correctly signed capture webhook belongs to a known payment.

Result: rejected.

Source: `payment-workflow-app/src/payment/webhookReconciler.mjs:3` checks `knownGatewayReferences` after signature validation and throws `Unknown gateway reference` (VIS-09); the protected webhook test passes.

Diagram decision: Show a distinct reference check and unknown-reference rejection before duplicate detection.

## BRIEF-04

Claim: Every valid capture delivery creates a new ledger entry.

Result: rejected.

Source: `payment-workflow-app/src/payment/webhookReconciler.mjs:4-5` returns `already-handled` for a duplicate before the single ledger write (VIS-10 then VIS-07); the duplicate test confirms the ledger count remains one.

Diagram decision: Show duplicate delivery terminating at `already_handled`, with ledger recording only on the new-event branch.
