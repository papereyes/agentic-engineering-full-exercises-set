# Release notes

This release adds a retry path and clearer guidance for declined card payments. It also contains a breaking rename in the billing export contract that requires consumer migration.

## Breaking change: billing export field renamed

Billing exports now return `total` instead of `invoiceTotal`. Any integration, report, or parser that reads `invoiceTotal` will stop receiving that field after upgrade.

Migration: update every billing-export consumer to read `total` before deploying this release. The provider contract passed (`CI-884-pact`), but the migration dry run is missing, so end-to-end migration readiness has not been demonstrated.

## Checkout retry and clearer declines

Declined card payments now display `Payment declined. Check the card and try again.` and can be retried. Other failed-payment states continue to display `Payment failed`.

Unit tests (`CI-881-unit`) and the browser test (`CI-881-e2e`) passed. The expected browser screenshot is missing, so visual verification evidence is incomplete.

## Verification gaps

- Checkout retry: browser screenshot is missing despite the passing browser test.
- Billing export rename: migration dry-run evidence is missing.

Because these expected artifacts are missing, the release is not fully verified for publication.

## Git traceability

- Billing export field rename: `1c4310183a6ef4fb9d2b1826464bd357b80e542f`
- Checkout retry and clearer declines: `d3b56d0c977ebeb81b01e8d001157e027ad0bf52`
