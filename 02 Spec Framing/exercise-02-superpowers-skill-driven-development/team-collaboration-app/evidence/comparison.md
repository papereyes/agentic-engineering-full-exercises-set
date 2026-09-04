# Before and After Comparison

## Fair Conditions

The before and after runs used the same OpenAI Codex agent, gpt-5.6-sol model with medium reasoning, Codex workspace tools, workspace-write filesystem with restricted network and no automatic approval, 60-minute limit, first attempt, zero human hints, zero retries, and exact feature prompt. Agent, model, tools, permissions, prompt, time limit, and attempt number are therefore identical. The deliberate variable is that the after run used the Superpowers workflow.

## Observed Invitation Risks

| Risk | Before patch and tests | After patch and tests |
|---|---|---|
| Authorization | The baseline checked active actors and `inviteRoles` inline. | The rerun reuses `canManageInvitations` for creation and revocation, removing duplicate policy logic. |
| Normalized duplicate email | The baseline trimmed and lowercased member and pending-invitation email comparisons. | The rerun centralizes trimming and lowercasing in `normalizeEmail` and applies it to both comparisons. |
| Guest policy | The baseline rejected guest invitations when `allowGuestInvites` was false. | The rerun preserves that guard and disables the native Guest option under the same policy. |
| Expiry | The baseline used configured expiry days and rejected actions at or after expiry. | The rerun uses `defaultInviteExpiryDays * 86_400_000` and one shared inclusive expiry check. |
| Single-use accept/revoke transitions | The baseline rejected finalized invitations. | The rerun requires `pending` before either transition and renders action buttons only while pending. |
| Rejected-state mutation | The baseline returned the supplied state from its rejection helper. | The rerun also returns the exact supplied state and constructs changed arrays only after validation. |

Both observed patches address the six lifecycle risks, and the recorded lifecycle run covers all 16 supplied tests. The after run additionally leaves durable decisions and independent review evidence: superpowers:brainstorming approved the design, superpowers:writing-plans framed the task boundaries, superpowers:test-driven-development retained Red and Green results, superpowers:requesting-code-review checked each task, and superpowers:verification-before-completion requires fresh final commands.
