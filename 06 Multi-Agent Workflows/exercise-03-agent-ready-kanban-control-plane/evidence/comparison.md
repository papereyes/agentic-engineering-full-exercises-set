# Comparison

## Same conditions

Both sides are bound to the same shared starting commit, `e83928ed3c4d34fd51039c65b3d86373687cb259`. The before side is the exercise-specific empty-tree snapshot of that commit; the after side is the Git diff from that commit to control commit `69b6dbb9b25b5198a4e21d9e01fac12539bd2b14`.

This is not a two-agent benchmark. Agent/model, time limit, and historical implementation permissions are not available from Git and are not reconstructed. Snapshot hints/retries: zero/zero. Current proof rerun hints: zero; command-environment retries: feature two, board one, recorded in [after.md](./after.md).

## Before

| Concern | Invalid snapshot at `e83928ed3c4d34fd51039c65b3d86373687cb259` |
|---|---|
| Assignment safety | ESC-118, ESC-122, and ESC-121 retained paths despite needs-info, blocked, or cancelled states |
| Collision | ESC-120 and ESC-122 both reserved scoring |
| Board consistency | Both JSON mirrors agreed on the same unsafe seeded reservations |
| History | ESC-120 stopped at ready-for-agent; no reviewed lane or merge existed |
| Behavior | Child incident scoring and badge used declared Low instead of inherited Critical |
| Deferred rule | ESC-122 had no approved boost or cap |

## After

| Concern | Reconciled state at `69b6dbb9b25b5198a4e21d9e01fac12539bd2b14` |
|---|---|
| Assignment safety | Only ESC-120 was assigned; every reservation is released after merge |
| Collision | No active collision; ESC-122 remains blocked without ownership |
| Board consistency | Documentation and application JSON mirrors are identical |
| History | Lane `93d105ec8aad54d52bec97f1d825cca6f9c76f72` was reviewed and merged by `072944ae351720e9a8636ce6af493b3e71f736c7` with two parents |
| Behavior | Inherited Critical drives scoring and the badge; 3 focused tests pass |
| Deferred rule | `RULE-ESC-122` remains explicit and unimplemented |

## Proof

- Specialized before patch: SHA-256 `76ab66b707d0e39f9be77024fc68e7160312c0154ab44f233419cf7e42359807`.
- Base-to-control after patch: SHA-256 `bc624308738b29426d0a14d13dad1fb28f87f87e778c0bddc24fd52751b50955`.
- Exact-SHA feature and board reruns both pass with exit 0.
- The pre-hardening full verifier at `86f7291569f1a2ec280a17fe20e2a05044211a93` passes with exit 0.

## Conclusion

The scoped Git history changes the control plane from unsafe reservations and incorrect inherited severity to one reviewed lane, released ownership, synchronized boards, and preserved unresolved work. The evidence proves repository state; it does not invent missing historical session logs.
