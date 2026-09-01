# Before and after comparison

The same conditions were used for both first attempts. Proof comes from the recorded commits, exact patches, and command exit codes.

### Fair Comparison

| Condition | Before | After | Same? |
|---|---|---|---|
| Starting commit | `52090edddf032d026ece16ef90feb627bf8e67ac` | `52090edddf032d026ece16ef90feb627bf8e67ac` | Yes |
| Production change | Exact README request | Exact README request | Yes |
| Agent and model | OpenAI Codex, gpt-5.6-sol, medium reasoning | OpenAI Codex, gpt-5.6-sol, medium reasoning | Yes |
| Tools and permissions | Workspace-write, restricted network, approval escalation | Workspace-write, restricted network, approval escalation | Yes |
| Time limit | 30 minutes | 30 minutes | Yes |
| Human hints | 0 | 0 | Yes |
| Retries | 0 | 0 | Yes |

### Results

| Metric | Before | After |
|---|---|---|
| Application check | Pass; exit code 0 | Pass; exit code 0 |
| Implementation check | Pass; exit code 0 | Pass; exit code 0 |
| Failed requirements | None | None |
| Files changed | 2 | 3, including onboarding |
| Lines added and removed | +17 / -16 | +43 / -16 |

### Conclusion

The onboarding did not improve the pass rate because the before agent already produced a correct implementation. It did improve the reusable repository context and led to a more explicit three-way filter flow in `App.tsx`; both patches use the shared routing boundary and active policy correctly. The measured result therefore supports a process and readability improvement, not a functional-correctness claim.
