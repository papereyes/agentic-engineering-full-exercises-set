# Before and After Comparison

### Fair Comparison

The runs started from the same commit and used the same production request and working conditions. The deliberate variable was Superpowers availability and its structured workflow.

### Same conditions

| Condition | Before | After |
|---|---|---|
| Starting commit | `52090edddf032d026ece16ef90feb627bf8e67ac` | `52090edddf032d026ece16ef90feb627bf8e67ac` |
| Agent | OpenAI Codex | OpenAI Codex |
| Model | gpt-5.6-sol, medium reasoning | gpt-5.6-sol, medium reasoning |
| Tools | Codex workspace tools | Codex workspace tools |
| Permissions | workspace-write filesystem, restricted network, no automatic approval | workspace-write filesystem, restricted network, no automatic approval |
| Time limit | 60 minutes | 60 minutes |
| Attempt / hints / retries | 1 / 0 / 0 | 1 / 0 / 0 |
| Prompt | Exact feature prompt recorded in `evidence/before.md` | Same exact feature prompt recorded in `evidence/after.md` |

### Before

- Implementation commit: `99829be0a6f9dd113bb4b40ee7806bfcefdef496`
- Patch: `evidence/before.patch`; SHA-256 `063bba301e33e2d3d2c416ebb941a13a463d492b6755659db9dfc344b6be380d`
- Superpowers was unavailable. No design, implementation plan, or independent review artifact was produced.
- `npm run test:invitations` passed 16/16 with exit code 0; invitation risks that failed: 0.

### After

- Final implementation commit: `ceab3cfd31812e394bd9bf966c1f041eb598ccb4`
- Patch: `evidence/after.patch`; SHA-256 `ab54bd1604d2395f0241bd1e3e2b2bff4daba20f864e8c8f21e2f1d9e0908c2b`
- Superpowers produced an approved design, executable plan, raw TDD evidence, isolated task sessions, independent task reviews, and a final whole-branch review.
- The final review found one missed acceptance-normalization path; its test-first resolution is included in the final implementation commit.

### Results

| Risk or quality dimension | Before patch and tests | After patch and tests |
|---|---|---|
| Authorization | Checked active actors and `inviteRoles` inline. | Reuses `canManageInvitations` for creation and revocation, preventing duplicated policy logic. |
| Normalized duplicate email | Trimmed and lowercased member and pending-invitation comparisons. | Centralizes comparison through `normalizeEmail`; acceptance also normalizes stored invitation email before constructing a member. |
| Guest policy | Rejected guest invitations when disabled. | Rejects through the service and disables the native Guest UI option under the same policy. |
| Expiry | Used configured days and rejected at or after expiry. | Uses `defaultInviteExpiryDays * 86_400_000` and one inclusive expiry helper. |
| Acceptance and revocation | Required pending status and rejected repeated final actions. | Requires pending status for both transitions; UI exposes actions only for pending invitations. |
| Rejected-state mutation | Returned the supplied state from rejection paths. | Returns the exact supplied state and constructs changed arrays only after validation. |
| Planning quality | No design or plan artifact. | `superpowers:brainstorming` produced the approved design and `superpowers:writing-plans` framed three bounded tasks before code. |
| Tests | 16 protected tests passed, but no durable raw TDD artifact remained. | The same 16 protected tests pass; raw Task 1 Red/Green output and a Red/Green unprotected acceptance-normalization regression are retained. |
| Final verification | No independent review or final workflow proof. | `superpowers:requesting-code-review` produced task reviews and a broad final review; post-review focused test, invitation suite, and typecheck exit 0, with the controller retaining the final full verification transcript. |

### Proof

- Both full-index comparison patches are anchored to the same 40-character starting SHA and their separate implementation SHAs.
- `evidence/tdd.md` cites the archived Task 1 JSONL events containing the unedited Red and Green output and records the post-review regression cycle.
- `evidence/skill-usage.md` maps every worker and reviewer role to an exact thread ID, archived session log, and retained report.
- `evidence/review.md` preserves the final reviewer’s blocking findings and records each resolution rather than replacing the original verdict.

### Conclusion

The evidence supports a qualified improvement from the skill-driven workflow: both implementations passed the 16 protected lifecycle tests and had zero final invitation-test failures, so Superpowers did not improve that measured pass count. It did improve process and maintainability evidence—an approved design and plan, shared authorization helper, raw TDD record, isolated-session provenance, and independent review. Most importantly, the broad review exposed the acceptance-normalization gap missed by the protected suite, and the final implementation now protects it with a test that demonstrably failed before the one-line production fix and passed afterward.
