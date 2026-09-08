# Test matrix

| Concern | Test action | Assertion |
|---|---|---|
| tax payload and readiness | navigate with a unique session | disabled state first; country IN and subtotal 99; Pay $106.92 |
| authorization payload | submit the approval card | cardholder, cardNumber, and total 106.92 |
| approval | complete checkout | Order confirmed |
| decline | submit the decline card | Payment declined |
| retry | choose Try another payment and resubmit | complete retry authorization body and Order confirmed |
| duplicate protection | dispatch two submit attempts | exactly one authorization request |
| isolation | reset a random x-checkout-session before every test | reset response identifies the same session |

Every assertion uses a user-facing role/label or the observable network boundary.
