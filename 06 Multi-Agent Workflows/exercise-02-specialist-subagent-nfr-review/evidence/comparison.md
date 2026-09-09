# Comparison

## Same conditions

Both states used the same four protected specialist commands, app directory, Node.js 25.9.0 runtime, installed dependencies, and detached-worktree method. Human hints were 0. The integration-owner captures each required one retry outside the subprocess sandbox after `spawnSync git EPERM`; the independent reports remain separate from those command captures.

## Before

Baseline `e83928ed3c4d34fd51039c65b3d86373687cb259` reproduced 3/3 security failures, 1/1 accessibility failure, 2/2 performance failures, and 2/2 testability failures. `before.patch` is explicitly the five-file risky-baseline snapshot from empty tree `4b825dc642cb6eb9a060e54bf8d69288fbee4904`, SHA-256 `4e2b66e8b91eaf3e35a61c7412b23dca606c1d6f4aef0efa6dff0383367be69e`.

## After

Remediation `354692d34864d66324f1af8b9469a3c792f68a9e` passed 3/3 security, 1/1 accessibility, 2/2 performance, and 2/2 testability checks in fresh after sessions and in the detached integration-owner reruns. `after.patch` is the exact baseline-to-remediation source diff, SHA-256 `08373a26b5b5b8ffd96469254a0a0f4775ba02cbeec89cdd9ffe82db693bb95c`.

| Area | Before | After |
|---|---|---|
| Security | Active note HTML and service bypass | Text rendering plus service-boundary actor/evidence checks |
| Accessibility | Clickable `div` rows | Native buttons with `aria-pressed` |
| Performance | 150,000 reductions and render-time recalculation | One reduction plus reviews-keyed memoization |
| Testability | Browser timer and real delay | Platform-neutral default with injected wait |
| Protected performance | 292.826 ms | 0.067 ms with identical scenario and result |
| Merge readiness | Blocked | Approved |

## Proof

The complete raw command outputs and exit codes are in `evidence/commands/`; specialist reasoning and provenance are in `evidence/specialists/`; exact report/output hashes are in `evidence/review-cycle.json`. The pre-hardening full verifier transcript records an authoritative exit 0 at branch HEAD `060b6652af3c36bd862e374a608193a30bc36891`.

## Conclusion

Under the same conditions, the exact baseline fails and the exact remediation passes; the evidence supports approval with only the documented manual and production-scale residual risks.
