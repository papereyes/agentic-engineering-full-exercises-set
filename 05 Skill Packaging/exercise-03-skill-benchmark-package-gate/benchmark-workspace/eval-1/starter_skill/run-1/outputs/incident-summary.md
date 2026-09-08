# Incident Summary: Checkout Retry Saturation

## Impact

318 checkout attempts failed. The number of unique customers affected was not measured.

## Timeline

- **09:02** — Checkout-error alert opened after the five-minute threshold was crossed.
- **09:11** — Payment retries were disabled as mitigation. Error volume decreased, but health probes continued to fail.
- **09:18** — Deployment `pay-184` removed the retry loop.
- **09:24** — Three consecutive payment and checkout probes passed, confirming recovery.

## Cause

The cause review is incomplete. The current hypothesis is that retry amplification exhausted the worker pool; this has not been confirmed.

## Resolution

Payment retries were disabled to reduce error volume, followed by deployment `pay-184` to remove the retry loop. Recovery was confirmed at 09:24 through three consecutive successful payment and checkout probes.

## Follow-up

- **Proposed, not started:** Add retry saturation alerting.
- **Owner:** Payments Platform.