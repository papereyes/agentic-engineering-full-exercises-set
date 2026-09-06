# Exercise 02 : Strangler Checkout Route

## Your Mission

Your team needs card checkout moved out of a legacy payment path without moving other consumers or risking duplicate authorization. Your mission is to introduce one safe strangler seam while preserving the complete public contract.

Card, gift-card, invoice, and unknown payment types currently share one implementation. A broad rewrite or unsafe fallback can change unrelated behavior or authorize a payment twice.

Compare an unconstrained extraction with a contract-backed card-only route and prove the fallback boundary.

The duration for this challenge is 45 min or less.

## Project

[checkout-strangler-app](./checkout-strangler-app) contains the all-legacy router and protected tests. The [checkout contract](./docs/checkout-contract.md) defines public fields, rounding, routes, and failure behavior.

## How To Go About It

1. Create two branches from the same starting commit. In the first branch, give a fresh coding agent the card-extraction request without the route contract. Do not correct or retry it. Save `evidence/before.md` and `evidence/before.patch`.

2. Review whether the result moves non-card consumers, changes public values, couples dependencies, or can fall back after an uncertain authorization.

3. In the second branch, add `checkoutRouter.test.mjs` with participant-owned card, compatibility, and fallback checks. Confirm it fails against the all-legacy starter, then commit only this test.

4. Start another fresh agent session under the same agent, model, tools, permissions, request, time limit, and first-attempt conditions. Ask it to create `cardCheckout.mjs` and update `checkoutRouter.mjs` so only enabled card requests use the injectable new slice. Do not correct or retry it.

5. A new-card failure must fall back once only when an object error explicitly proves no authorization was created. Ambiguous, primitive, malformed, or post-authorization failures must return the established failure result without calling legacy checkout.

6. Run the precommitted participant test and protected route suite without changing the test. Prove gift-card, invoice, unknown, flag-off, safe-fallback, and unsafe-no-fallback routes. Do not delete or rewrite the legacy path.

7. Commit only the router and card slice as the agent source commit. Use the participant-test commit as the after run base so `after.patch` contains only agent work. Save the remaining evidence and final comparison.

The two agents may produce the same correct source patch. In that ceiling case, record it honestly; the controlled run still proves the explicit fallback contract, route matrix, and focused history.

## Evidence

Submit:

- The precommitted participant test, router, and card slice.
- `evidence/before.md`, `evidence/before.patch`, `evidence/after.md`, and `evidence/after.patch`.
- `route-matrix.md`, `contract-comparison.md`, `rollback.md`, `history.json`, and `evidence/comparison.md`.
- Automatically captured command output and output from `npm run verify:exercise`.
- A focused pull request containing only this exercise.

From `checkout-strangler-app`, run `npm run evidence:capture -- --output ../evidence/commands/strangler-verify.txt -- npm run evidence:verify`. This records the command, commit, timestamps, output, and exit code without requiring its own output file. Then run `npm run verify:exercise` before raising the PR. It checks protected inputs, matched run evidence, application quality, exact checkout contract, card-only routing, injectable seams, failure fallback, source scope, history, and required proof.

For the required before and after files, follow the [evidence instructions and template](./docs/evidence-template.md) and the repository [submission standard](../../docs/SUBMISSION_STANDARD.md).

## Completion Criteria

The challenge is complete when:

- Both agent attempts use matching conditions and genuine first-attempt patches; identical correct patches are allowed.
- Only enabled card requests reach the new slice; every other request remains legacy.
- Public fields and rounding stay unchanged, dependencies are injectable, and rollback is explicit.
- Safe pre-authorization failures fall back exactly once, while uncertain or completed authorizations never retry through legacy.
- `npm run verify:exercise` passes, the red participant test precedes the source commit, and the source commit contains only the router and card slice.
