# Playwright MCP investigation

The official Playwright MCP opened URL `http://127.0.0.1:5173`. A `browser_snapshot` captured the disabled `Pay $99.00` button while tax showed `Calculating...`; a later `browser_snapshot` showed enabled `Pay $106.92`.

`browser_network_requests` found `POST /api/tax-quote`. `browser_network_request` showed request body `{"country":"IN","subtotal":99}` and response `{"tax":7.92}`.

For `POST /api/payments/authorize`, `browser_network_request` showed the approval payload `{"cardholder":"Asha Kumar","cardNumber":"4242424242424242","total":106.92}`. The visible outcome was `Order confirmed`.

Using cardNumber `4000000000000000` produced `Payment declined`; selecting `Try another payment`, restoring the approval number, and submitting again produced `Order confirmed`.

A live double-click generated exactly one additional authorization request. This observation motivated the duplicate-submission request-count assertion. Development mode also issued duplicate tax requests on initial rendering, so the tests assert the payload rather than an incorrect global tax count.
