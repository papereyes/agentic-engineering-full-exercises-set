# Before and After Comparison

## Fair Conditions

The runs used the same OpenAI Codex agent, gpt-5.6-sol model with medium reasoning, workspace tools, restricted network and workspace-write permissions, 60-minute limit, first attempt, and exact feature prompt. This keeps the agent, model, task, and operating conditions identical; the meaningful variable is the Superpowers workflow.

## Invitation Risks

| Risk | Before | After |
|---|---|---|
| Authorization and workspace policy | Passed tests, but duplicated the actor rule inside the invitation service. | Passed tests and reused `canManageInvitations`, leaving one policy source. |
| Duplicate email identity | Normalized member and pending-invitation comparisons. | Preserved the same case-insensitive behavior and documented it before coding. |
| Guest policy | Rejected guest creation when disabled. | Preserved the guard and connected it to the approved design and lifecycle test evidence. |
| Expiry | Used configured days and rejected actions at or after expiry. | Preserved both boundaries with an explicit design rule and RED/GREEN record. |
| Single-use acceptance and revocation | Finalized invitations and rejected repeated actions. | Preserved those transitions and reviewed both paths against the immutable-state requirement. |
| Rejected state mutation | Returned the original state on rejection. | Kept validation before state construction and recorded mutation safety as a review criterion. |

## Workflow Difference

Both implementations satisfy the supplied functional contract. The after run adds traceability: superpowers:brainstorming produced an approved design, superpowers:writing-plans fixed task order, superpowers:test-driven-development retained the failing-to-passing proof, superpowers:requesting-code-review recorded findings and resolution, and superpowers:verification-before-completion requires fresh command evidence before completion.
