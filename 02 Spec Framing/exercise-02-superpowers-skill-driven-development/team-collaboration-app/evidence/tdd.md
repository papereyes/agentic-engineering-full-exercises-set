# Invitation Lifecycle TDD

## Red

Before production implementation, `npm run test:invitations` exited with code 1:

```text
> team-collaboration-app@0.1.0 test:invitations
> node ./scripts/run-invitation-tests.mjs

Invitation tests failed: implement createInvitation, acceptInvitation, and revokeInvitation in src/services/invitationService.ts.
```

This is the expected failure because the supplied lifecycle contract still reached the throwing starter implementation.

## Green

After the minimum lifecycle implementation, `npm run test:invitations` completed with exit code: 0:

```text
> team-collaboration-app@0.1.0 test:invitations
> node ./scripts/run-invitation-tests.mjs

✔ authorized creation normalizes email and uses the configured expiry
✔ an active admin listed in inviteRoles may create an invitation
✔ members and suspended actors cannot create invitations
✔ target roles and the guest policy are enforced
✔ invalid email addresses are rejected without mutation
✔ existing member email comparison is case-insensitive
✔ an unexpired pending invitation blocks a case-insensitive duplicate
✔ an expired pending invitation does not block a replacement
✔ duplicate invitation identifiers are rejected
✔ accepting a pending invitation adds one member and finalizes the invitation
✔ expired invitations cannot be accepted
✔ accepted and revoked invitations cannot be accepted
✔ acceptance rejects a duplicate member identifier
✔ an authorized actor may revoke a pending invitation only once
✔ unauthorized actors and expired invitations cannot be revoked
✔ unknown invitation identifiers are rejected
ℹ tests 16
ℹ suites 0
ℹ pass 16
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
```

`npm run typecheck` also exited with code 0.
