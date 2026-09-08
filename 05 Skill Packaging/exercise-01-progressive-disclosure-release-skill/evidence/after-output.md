## Customer-facing changes

### Retry declined card payments

Customers now receive a clearer decline message and can retry payment after a card is declined.

- Compatibility: Non-breaking.
- Verification: `unit tests` passed (`CI-881-unit`); `browser test` passed (`CI-881-e2e`).
- Missing evidence: No browser screenshot was provided, so visual confirmation remains incomplete.
- Trace: `d3b56d0c977ebeb81b01e8d001157e027ad0bf52` — `src/checkout.js`

### Breaking: Billing export field renamed

Billing exports now use `total` instead of `invoiceTotal`.

- Migration: Update integrations, schemas, queries, and field mappings from `invoiceTotal` to `total` before upgrading. The old field is no longer emitted.
- Verification: `provider contract` passed (`CI-884-pact`).
- Missing evidence: `migration dry run` was not provided; migration behavior remains unverified.
- Trace: `1c4310183a6ef4fb9d2b1826464bd357b80e542f` — `src/billing-export.js`

Range: `exercise-base..origin/exercise-head`

Prepared using the [release-notes skill](/tmp/exercise-05-01-full-fixture-finalproof/.agents/skills/release-notes/SKILL.md).
