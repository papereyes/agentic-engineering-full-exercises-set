# Team Invitations Design

## Goal

Add a Team Invitations section that supports creating, listing, accepting, and revoking invitations while enforcing workspace policy and preserving all member and invitation data when an action is rejected.

## Architecture

The existing `App` component owns one `InvitationState` initialized from the seeded members and workspace policy. The existing pure functions in `src/services/invitationService.ts` are the only place that applies invitation rules. Each successful function returns a new state; validation completes before any arrays or records are copied or changed. The UI replaces its state only when a service action succeeds and displays the returned error code otherwise.

No reducer, service class, persistence layer, or dependency is added. React state, native form controls, `crypto.randomUUID()`, and ISO timestamps cover the requested workflow.

## Creation Rules

The UI collects an actor, email, and target role. The service trims and lowercases the email before comparison or storage. It rejects malformed email, unsupported target roles, guest invitations when `allowGuestInvites` is false, actors who are missing, suspended, or absent from `policy.inviteRoles`, an email already belonging to a member, an unexpired pending invitation for the same normalized email, and duplicate invitation identifiers.

A successful invitation records the normalized email, selected member or guest role, actor ID, creation time, pending status, and an expiry calculated from `policy.defaultInviteExpiryDays`. Expired or finalized invitations do not block a later replacement invitation.

## Acceptance and Revocation

Acceptance requires an existing pending invitation whose expiry is later than the action time and a member ID that does not already exist. Success marks the invitation accepted and adds exactly one active member with the invitation email and role. A second acceptance, an acceptance after revocation, an expired invitation, and an unknown invitation are rejected without changing state.

Revocation additionally requires an active actor allowed by `policy.inviteRoles`. Success marks one pending invitation revoked. A second revocation, revocation after acceptance, expired invitation, unauthorized actor, and unknown invitation are rejected without changing state.

## Interface

The Team Invitations section contains a labelled creation form and an invitation list. Each row shows email, role, inviter, expiry, and status. Pending rows expose Accept and Revoke controls; finalized rows remain visible but cannot be acted on. The UI generates invitation and member identifiers with the browser crypto API and passes the current ISO time to the service. A compact status message announces success or the returned error code.

The actor selector includes the seeded members so policy rejection is observable rather than hidden by the interface. Native email and select inputs provide baseline validation and keyboard accessibility, while the service remains authoritative at the trust boundary.

## Error and State Guarantees

Every rejection returns `ok: false`, the appropriate existing `InvitationErrorCode`, and member/invitation data identical to the input. Validation precedes state construction so no partial invitation, member, or status update can escape. The service does not call the unsafe mutating `quickInvite` prototype.

## Testing and Verification

The supplied `tests/invitationService.test.ts` is the executable lifecycle contract. First run it against the throwing starter to record the required red state, then implement only enough service behavior to satisfy all 16 tests. After wiring the UI, run invitation tests, type checking, linting, formatting, build, submission verification, and the repository agent check. Review the final diff for policy bypasses, duplicate normalization, expiry boundaries, one-time transitions, mutation safety, and accessibility basics.
