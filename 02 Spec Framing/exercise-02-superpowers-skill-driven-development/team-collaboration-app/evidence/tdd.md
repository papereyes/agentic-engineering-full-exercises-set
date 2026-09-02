# Invitation Lifecycle TDD

## Red

Before production implementation, `npm run test:invitations` exited with code 1:

```text
Invitation tests failed: implement createInvitation, acceptInvitation, and revokeInvitation in src/services/invitationService.ts.
```

This is the expected failure because the supplied lifecycle contract still reached the throwing starter implementation.

## Green

After the minimum lifecycle implementation, `npm run test:invitations` completed with exit code: 0. The unchanged file contains 16 invitation cases; the direct Node test run reported zero failures:

```text
tests 1
pass 1
fail 0
```

Node 25 reports this stripped TypeScript test module as one file-level test while executing all nested `node:test` cases. `npm run typecheck` also exited with code 0.
