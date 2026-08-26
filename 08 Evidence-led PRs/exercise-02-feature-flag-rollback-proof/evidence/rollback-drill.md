# Invoice Preview Rollback Drill

Source SHA: 3a0b04586999a946b691600de1f74aff816c05d6

Command: `node scripts/rollback-invoice-preview.mjs --config <temporary-config> --actor release-engineer --reason "Invoice preview error rate exceeded rollback threshold" --timestamp 2026-08-14T10:30:00.000Z --expected-revision rollout-2026-08-14`

Start time: 2026-08-26T06:54:25.446Z
End time: 2026-08-26T06:54:25.478Z
Elapsed: 30.953 ms

## Before rollback

- Flag: enabled
- Revision: rollout-2026-08-14
- Experience: preview
- API calls: 1
- Telemetry events: 1, invoice_preview_viewed

## After rollback

- Flag: disabled
- Target allowlist: empty
- Revision: rollback-2026-08-14T10-30-00-000Z
- Previous revision: rollout-2026-08-14
- Experience: legacy
- API calls: 0
- Telemetry events: 0

Result: PASS. The rollback changed behavior without a deployment and completed within the 1000 ms objective.

Invalid-input check: PASS. An invalid timestamp returned non-zero and left the configuration unchanged.

Interrupted update: PASS. Fault injection stopped before replacement, preserved the original bytes, and left no temporary or lock files.

Concurrent rollback: PASS. Exactly one command replaced the expected revision and the other was rejected.

Remaining cleanup: Remove invoice-preview-v2 and preview-specific telemetry after rollout retirement approval.
