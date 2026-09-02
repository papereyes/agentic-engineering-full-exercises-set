# After Superpowers

### Run

- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Implementation commit: 5e8b4dea96d1bda789d48b2fc8eaff132f35f396
- Agent: OpenAI Codex
- Model: gpt-5.6-sol, medium reasoning
- Tools: Codex workspace tools
- Permissions: workspace-write filesystem, restricted network, no automatic approval
- Time limit: 60 minutes
- Attempt: 1
- Human hints: 0
- Retries: 0
- Superpowers available: Yes; superpowers:brainstorming, design approval, planning, test-driven development, review, and verification governed the run
- Prompt: Add a Team Invitations section. An active owner or admin allowed by the workspace policy may invite an email as a member or guest. Guest invitations are allowed only when the workspace policy permits them. Prevent invitations for existing members or an email with a pending invitation. Invitations must use the configured expiry period and may be accepted or revoked only once. Rejected actions must not change invitation or member data.
- Patch: `evidence/after.patch`
- Patch SHA-256: 57d1adae67cb2e2099a0b8524946ed0f06e524158e38f7cfd5874df4312feb73

### Results

| Proof | Result |
|---|---|
| `npm run test:invitations` | Pass; exit code: 0; all 16 supplied cases executed with zero failures |
| `npm run submission:verify` | Pass; exit code: 0; workflow evidence, implementation wiring, and challenge integrity complete |
| `npm run agent:check` | Pass; exit code: 0; protected challenge files unchanged |
| `npm run verify:exercise:core` | Pass; exit code: 0; integrity, implementation, submission, typecheck, and build gates complete |
| `npm run verify:exercise` | Pass; exit code: 0; the full core suite completed and left tracked, index, untracked, and ignored state unchanged |
| Design created before code | Yes; approved design committed as 672ec99 |
| Plan created before code | Yes; implementation plan committed as 5e8b5f7 |
| Failing test recorded first | Yes; see `evidence/tdd.md` |
| Review completed | Yes; see `evidence/review.md` |
| Source files changed | 3 |
| Source lines added and removed | `+271 / -8` |

### Outcome

The invitation service enforces the shared actor policy, normalized identity checks, guest policy, configured expiry, single-use transitions, and immutable rejection behavior. The Team Invitations interface delegates creation, acceptance, and revocation to that service and displays current invitation and member state.
