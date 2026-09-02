# Handoff Comparison

## Fair Comparison

Both first-attempt sessions started from commit `52090edddf032d026ece16ef90feb627bf8e67ac` and used the same exact incident request, Codex agent, `gpt-5.6-sol` model with medium reasoning, repository inspection/edit/shell tools, workspace-write permissions, restricted network, 30-minute limit, and zero implementation hints or retries. Each received the same content-free procedural design approval after independently proposing a fix. The only intended context difference was raw session history Before versus verified Handoff context After.

## Results

| Proof | Before | After |
|---|---|---|
| Context | Raw session history, 504 words | Verified handoff, 605 words |
| Requirement selection | 4 current requirements followed | 4 current requirements followed |
| Stale claims followed | 0 | 0 |
| Owner/manual behavior broken | 0 | 0 |
| Verification | 10 of 10 incident checks passed | 10 of 10 incident checks passed |
| Files changed | 2 | 2 |
| Patch size | `+3 / -7` | `+3 / -5` |

Both implementations selected the approved 48-hour requirement, preserved owner and manual escalation behavior, and saved the queue state. The Before agent independently found the authoritative sources despite the contradictory context. The After agent reached the same implementation from the audited handoff and retained two existing explanatory comments, so the implementation patches are genuine and different.

## Conclusion

In this run, the verified handoff did not improve functional correctness: both first attempts passed every incident verification check and followed no stale claim. It did improve source prioritization by presenting the current policy, protected behavior, remaining work, and verification commands directly, but its 605-word context was 101 words larger than the 504-word raw history. The evidence therefore supports clearer verified context, not a measurable correctness or context-size advantage for this particular pair of runs.
