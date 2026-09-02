---
status: accepted
---

# Authorize AI-history export at the workspace-membership boundary

## Decision

AI-history export is authorized only when the Workspace plan is `Enterprise`, its Data Residency is `standard`, and the requesting User has an `active` Membership with the `admin` Role in that same Workspace. Billing ownership does not grant Workspace access or export authority.

The authoritative source is `docs/current-access-policy.md`. The support scenario in `docs/support-example.md` demonstrates the boundary without replacing that policy.

## Rejected Interpretations

- The Growth-tier and billing-owner interpretation from `docs/legacy-rollout-notes.md` is rejected because that document is a superseded draft.
- A matching admin label without matching Membership user, Membership status, and same-Workspace scope is insufficient.
- The completion claim in `docs/previous-agent-progress.md` is unsupported because it follows the legacy interpretation.

## Consequences

Authorization must fail closed when any plan, data-residency, user, Workspace, status, or Role condition is absent or mismatched. A User who owns the Billing Customer still needs an eligible active admin Membership in the Workspace being exported.
