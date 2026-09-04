# Team Invitations Design

## Goal

Add a visible Team Invitations section backed by one shared invitation lifecycle. Active owners and admins listed by the workspace policy can create member invitations, or guest invitations when guest access is enabled. Creation, acceptance, and revocation must reject invalid actions without mutating the supplied state.

## Architecture

Keep lifecycle rules in `src/services/invitationService.ts` as three pure state-transition functions: `createInvitation`, `acceptInvitation`, and `revokeInvitation`. Each function validates the complete action first, then returns a new state only on success. Rejected results return the original state unchanged. The service will reuse `canManageInvitations` for actor authorization and the existing types for results and error codes.

`src/App.tsx` will own the demonstration state with React's built-in state hooks. Its Team Invitations form and action buttons will call the shared service rather than duplicate policy checks. No new dependency, persistence layer, routing, or API is needed for this local application.

## Creation Rules

The service will normalize an email by trimming whitespace and converting it to lowercase, then validate its basic address shape. Only the target roles `member` and `guest` are valid. A guest target is rejected when `allowGuestInvites` is false.

The actor must exist, be active, and have a role included in `policy.inviteRoles`. A normalized email matching any member is rejected. It is also rejected when it matches an unexpired pending invitation. Invitation identifiers must be unique across all invitation records.

On success, the service creates a pending invitation using the normalized email, supplied actor and identifier, and supplied current time. Its expiry is the current time plus `policy.defaultInviteExpiryDays` calendar days, expressed as an ISO timestamp.

## Acceptance and Revocation

Acceptance finds an invitation by identifier, requires it to be pending and strictly unexpired, and rejects a member identifier already in use. It atomically marks the invitation accepted and adds one active member using the invitation's normalized email and role.

Revocation performs the same actor authorization used for creation, then finds a pending, strictly unexpired invitation and atomically marks it revoked. Accepted or revoked invitations reject all later acceptance or revocation attempts, so every invitation has at most one final transition.

Unknown identifiers, expired invitations, finalized invitations, unauthorized actors, and duplicate member identifiers return the existing error codes. Validation precedes all array changes, preventing partial updates on rejection.

## Interface

The Team Invitations section will provide native controls for actor, email, and target role. Guest selection will be disabled when the workspace policy forbids guest invitations. Pending invitation rows will expose accept and revoke buttons; finalized rows will remain visible with their status. The interface will display the service's error code or a short success message and will update local state only from successful service results.

Generated invitation and member identifiers will be unique within the current client state. The interface is a local demonstration of the domain rules; delivery tokens, email transport, authentication, and server persistence remain outside this request.

## Testing and Verification

The protected lifecycle tests define the service contract: authorization, guest policy, email normalization and validation, existing-member and pending-invitation duplicates, configured expiry, unique identifiers, immutable inputs, single-use acceptance and revocation, and rejection without mutation.

Implementation will follow test-first development by first running the invitation suite against the throwing starter service and recording that expected failure, then adding the minimum service and UI code. Final verification will run the invitation suite, static checks, build, and repository submission checks.
