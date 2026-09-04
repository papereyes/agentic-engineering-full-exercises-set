# Test-Driven Development Evidence

## Red

- Command: `npm run test:invitations`
- Result: exit code 1; the first lifecycle test failed because the starter `createInvitation` threw `Invitation lifecycle is not implemented`.

## Green

- Command: `npm run test:invitations`
- Result: exit code 0; all 16 lifecycle tests passed.
