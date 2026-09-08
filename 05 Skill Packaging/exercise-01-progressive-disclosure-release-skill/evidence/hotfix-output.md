# Hotfix release notes

Range: `exercise-base..hotfix-head`

## Customer-facing changes

### Retry declined card payments with clearer guidance

Customers can now retry checkout after a card decline. The checkout message explains that the card was declined and prompts them to check the card before trying again.

Git trace:

- Commit: `d3b56d0c977ebeb81b01e8d001157e027ad0bf52`
- Subject: `fix checkout maybe retry declined cards`
- Changed file: `src/checkout.js`

Verification status: automated checks passed; visual evidence is incomplete.

- `unit tests` — passed (`CI-881-unit`)
- `browser test` — passed (`CI-881-e2e`)
- Browser screenshot — missing; no evidence ID was supplied, so visual verification cannot be confirmed.
