# Playwright MCP investigation

## Original first-attempt observations

The original treatment recorded the following observations before implementation, but did not preserve a chronological tool transcript: disabled `Pay $99.00` while tax was calculating; enabled `Pay $106.92` after tax; tax body `{"country":"IN","subtotal":99}`; approval body `{"cardholder":"Asha Kumar","cardNumber":"4242424242424242","total":106.92}`; approval, decline, retry, and duplicate-submit outcomes. These remain narrative evidence only.

## Review rerun — not original treatment evidence

The following rerun was completed before the review-fix test edit. At `2026-09-08T06:29:28Z`, `git status --short --branch` showed only the clean branch header `exercise-04-01-after...origin/exercise-04-01-after`.

### Configuration and setup

`codex mcp get playwright` reported:

```text
playwright
  enabled: true
  transport: stdio
  command: npx
  args: @playwright/mcp@latest --browser chromium
```

Command: `npm run setup:check`

```text
Node.js 24.20.0: ready
Playwright Chromium: /home/papereyes/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
Local setup is ready. The starter browser smoke test runs next.
Running 1 test using 1 worker
1 passed (4.1s)
```

Exit code: 0.

### Ordered MCP calls and relevant output

1. `browser_navigate({"url":"http://127.0.0.1:5173/?review-loading=1"})`
   - Opened the live checkout at `http://127.0.0.1:5173`.
2. `browser_snapshot({"depth":6})`
   - Exposed `Tax quote $7.92`, `Total $106.92`, cardholder `Asha Kumar`, card number `4242424242424242`, and enabled `Pay $106.92`.
3. `browser_network_requests({"static":false,"filter":"/api/"})`
   - Listed `POST /api/tax-quote` as request 14 with `200 OK`.
4. `browser_network_request({"index":14,"part":"request-body"})`
   - Returned `{"country":"IN","subtotal":99}`.
5. `browser_run_code_unsafe(...)`, `browser_evaluate(...)`, then `browser_snapshot({"depth":5})`
   - Installed a temporary unresolved route gate without modifying the authorization request, clicked Pay, and captured the button as `Authorizing...` and disabled. The gate was then released and the unmodified request completed.
6. `browser_network_requests({"static":false,"filter":"/api/payments/authorize"})` and `browser_network_request({"index":30,"part":"request-body"})`
   - Returned approval body `{"cardholder":"Asha Kumar","cardNumber":"4242424242424242","total":106.92}` and `200 OK`; the next snapshot contained `Order confirmed`.
7. `browser_type(...)`, `browser_click(...)`, and `browser_snapshot({"depth":6})`
   - Submitted `4000000000000000`; the snapshot contained the `Payment declined` alert and `Try another payment` button.
8. `browser_click(...)`, `browser_type(...)`, `browser_click(...)`, and `browser_network_requests(...)`
   - Retried with `4242424242424242`. Requests 31 and 32 were the decline (`402`) and retry approval (`200`).
9. `browser_network_request({"index":31,"part":"request-body"})` and `browser_network_request({"index":32,"part":"request-body"})`
   - Returned the complete decline and retry bodies respectively: `{"cardholder":"Asha Kumar","cardNumber":"4000000000000000","total":106.92}` and `{"cardholder":"Asha Kumar","cardNumber":"4242424242424242","total":106.92}`. The following snapshot contained `Order confirmed`.
10. `browser_run_code_unsafe(...)`, `browser_evaluate(...)`, `browser_network_requests(...)`, and `browser_network_request({"index":47})`
    - Reset isolated session `review-duplicate`, dispatched two submit events, and observed one additional authorization request. Request 47 carried `x-checkout-session: review-duplicate` and returned `200 OK`.

The rerun confirmed the contract and motivated the review correction, but it does not replace or reconstruct the original first-attempt chronology.
