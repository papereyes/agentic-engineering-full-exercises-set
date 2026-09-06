# Replay Contract

Use the supplied `tasks/policy-217-replay.md` brief to construct a new replay. The original application and provider trace are not included, so this is a controlled simulation, not a live agent transcript. The `agent` and `model` values identify the simulated profile and must match `session-metadata.json`; `captureMode`, `promptHash`, and `timeLimitMinutes` must also match. `sessionId` must differ.

Each replay event must have a unique `eventId`, the replay `sessionId`, and an ISO `capturedAt` timestamp. The trace must retain ordered raw events and contain reads, a failed focused test, diagnosis, a later passed focused test, a write, and a passed final verification after the last write. Build a new replay from the brief. Do not copy, splice, renumber, or lightly rewrite the protected baseline events.

Passing requires zero unchanged failed-command retries, at least two fewer preventable calls than baseline, and `correctnessPassed: true`. Duplicate reads and oversized context are reported even if the chosen improvement does not address them.
