# Team Invitations Code Review

## Scope

Reviewed `src/services/invitationService.ts`, `src/App.tsx`, and `src/styles.css` against the approved design, supplied invitation lifecycle tests, workspace policy helper, support incidents, and protected-input rules.

## Findings

### Minor: invitation actions could overflow on narrow screens

- Severity: Minor
- Evidence: `.invitation-card` used a horizontal flex row without wrapping.
- Resolution: Added `flex-wrap: wrap` so invitation details and action buttons remain usable at narrow widths.
- Verification: `npm run format`, `npm run typecheck`, and `npm run build` pass after the change.

### Resolved during implementation: protected TypeScript configuration

- Severity: Important
- Evidence: enabling TypeScript-extension imports by editing `tsconfig.json` caused `npm run submission:verify` to report a protected challenge file change.
- Resolution: Restored `tsconfig.json` exactly and used a narrow `@ts-expect-error` on the explicit `.ts` runtime import required by Node's strip-types runner.
- Verification: `npm run test:integrity`, `npm run test:invitations`, and `npm run typecheck` pass.

## Final Assessment

No findings remain unresolved. Creation authorization, guest policy, normalized duplicates, expiry boundaries, accept/revoke finality, and rejected-state immutability are covered by the unchanged supplied tests. The UI uses the shared service for every lifecycle action, and no unsafe legacy helper or new dependency was introduced.
