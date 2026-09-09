# Accessibility specialist — before

Reviewed SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`
Independent specialist session: `a11y-06-02-e83928e-146036`

A11Y-01 (blocker) at `nfr-swarm-app/src/components/AccessReviewQueue.tsx:13`. Reproduction: render the queue and inspect its rows; no button or aria-pressed state exists. Impact: keyboard users cannot reliably select a review and assistive technology cannot announce selection. Recommendation: use native buttons with `type="button"` and `aria-pressed`.

## Review provenance

The finding and recommendation above are the independent specialist's reasoning from the named session. `evidence/commands/accessibility-before.txt` is a later integration-owner rerun in a detached worktree at the same 40-character SHA; it is not reconstructed historical output from that specialist session.
