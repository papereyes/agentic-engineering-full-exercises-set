# Before Superpowers

### Run

- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Implementation commit: 99829be0a6f9dd113bb4b40ee7806bfcefdef496
- Agent: OpenAI Codex
- Model: gpt-5.6-sol, medium reasoning
- Tools: Codex workspace tools
- Permissions: workspace-write filesystem, restricted network, no automatic approval
- Time limit: 60 minutes
- Attempt: 1
- Human hints: 0
- Retries: 0
- Superpowers available: No; the session ran without Superpowers enabled
- Prompt: Add a Team Invitations section. An active owner or admin allowed by the workspace policy may invite an email as a member or guest. Guest invitations are allowed only when the workspace policy permits them. Prevent invitations for existing members or an email with a pending invitation. Invitations must use the configured expiry period and may be accepted or revoked only once. Rejected actions must not change invitation or member data.
- Patch: `evidence/before.patch`
- Patch SHA-256: 063bba301e33e2d3d2c416ebb941a13a463d492b6755659db9dfc344b6be380d

### Results

| Proof | Result |
|---|---|
| `npm run test:invitations` | Pass; exit code: 0; 16/16 tests passed |
| Invitation risks that failed | 0 |
| Design created before code | No |
| Failing test recorded first | Yes in session output, but no durable TDD artifact was created |
| Review completed | No |
| Files changed | 3 |
| Lines added and removed | `+266 / -8` |

### Important Problems

- No design or implementation plan was created before production changes, so authorization, duplicate-email, guest-policy, expiry, and lifecycle decisions have no durable rationale.
- `src/services/invitationService.ts:16-18` and `src/services/invitationService.ts:81-83` duplicate the existing invitation-authorization rule instead of sharing the repository policy helper, creating a future drift risk even though the supplied tests pass.
- No code-review artifact or resolution record exists, so the passing behavior has no independent review proof.
