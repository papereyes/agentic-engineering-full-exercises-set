# Security specialist — before

Reviewed SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`
Session: `fce8758a-b63f-4cb7-aa4a-2466bc4c888d`

SEC-01 (blocker) at `nfr-swarm-app/src/components/ReviewNote.tsx:6`. Reproduction: render a note containing an image with an error handler; the output preserves live markup. Impact: an attacker-controlled note can execute in an operator browser. Recommendation: render the note as React text.

SEC-02 (blocker) at `nfr-swarm-app/src/services/accessReviewApi.ts:5`. Reproduction: call the service directly with an unauthorized actor or incomplete privileged evidence. Impact: callers can bypass the UI and approve unsafe access. Recommendation: require an explicit actor, structured errors, and boundary validation.
