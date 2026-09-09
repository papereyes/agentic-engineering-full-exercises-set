# Legacy and Code Contradictions

## LEG-01 — direct data-owner routing

Claim: "All requests ... directly to data-owner approval."

Source: `workflow-reconstruction-app/src/workflow.tsx:71-76` routes a high risk request from manager approval into `security-review` through the policy engine.

Decision: The diagrams split high risk from normal risk. Only normal risk goes directly to data-owner review; high risk passes through security review first.

## LEG-02 — security outside the application

Claim: "Security review happens outside this application and does not affect routing."

Source: `workflow-reconstruction-app/src/workflow.tsx:71-94` implements both entry to `security-review` and Security's transition to `data-owner-review`.

Decision: The state and approval diagrams include Security as an implemented actor and show that security review changes application routing for high risk access.

## LEG-03 — automatic provisioning retry

Claim: "Provisioning failures retry automatically until access is granted."

Source: `workflow-reconstruction-app/src/workflow.tsx:108-130` sends unhealthy provisioning to `failed-provisioning`, then WF-09 requests rollback. No edge returns to provisioning.

Decision: The diagrams show the unhealthy branch continuing to rollback and deliberately contain no automatic retry edge.

## LEG-04 — rollback and identity admin are external

Claim: "Rollback and identity-administrator actions are outside the application, so the only completed workflow state is provisioned."

Source: `workflow-reconstruction-app/src/workflow.tsx:125-139` implements `rollback-requested` to `rolled-back` and records Identity admin removing partial access.

Decision: The state diagram treats both `provisioned` and `rolled_back` as terminal outcomes, and the failure sequence assigns removal to `IdentityAdmin`.

## CODE-01 — normal-path UI progress conflict

Claim: The UI progress model marks security review complete for every request that reaches data-owner review or later.

Source: `workflow-reconstruction-app/src/workflow.tsx:14-21` defines `completedStagesByStatus` so `security-review` appears complete at `data-owner-review`, even on the normal route that WF-04 sends directly there.

Decision: The diagrams follow the executable normal branch and do not invent a security review. This unresolved UI progress conflict is recorded rather than silently altering product source outside the exercise scope.
