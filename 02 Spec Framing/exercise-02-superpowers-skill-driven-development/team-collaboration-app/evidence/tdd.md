# Test-Driven Development Evidence

- Execution: the fresh isolated Task 1 CLI worker ran Red before implementation commit `114686b`, then ran Green after the minimum lifecycle implementation.

## Red

- Command: `npm run test:invitations`
- Result: exit code 1; the first lifecycle test failed because the starter `createInvitation` threw `Invitation lifecycle is not implemented`.

## Green

- Command: `npm run test:invitations`
- Result: exit code 0; all 16 lifecycle tests passed.
