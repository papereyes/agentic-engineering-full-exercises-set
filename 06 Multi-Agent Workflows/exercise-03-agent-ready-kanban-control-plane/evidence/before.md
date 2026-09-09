# Before

## Same conditions

This is the exercise-specific invalid-control-plane snapshot, not a second agent/model run. The shared starting and snapshot implementation commit is `e83928ed3c4d34fd51039c65b3d86373687cb259`. The specialized run base is Git's empty tree, `4b825dc642cb6eb9a060e54bf8d69288fbee4904`. It uses the repository's committed initial board/control files and starting scoring/badge exactly as stored at the base commit.

Agent, model, permissions, and time limit are not applicable to a commit-bound snapshot. Hints: zero. Retries: zero. No historical transcript was reconstructed.

## Before

The initial control plane was invalid:

- ESC-118 was `needs-info` but reserved `src/services/workflowApi.ts`.
- ESC-122 was blocked by ESC-120 and `RULE-ESC-122` but also reserved ESC-120's `src/utils/scoring.ts`.
- ESC-121 was cancelled but retained `src/services/exportApi.ts`.
- ESC-120 was the only ready-for-agent card and its three lane prefixes were the only valid reservations.
- `calculateSeverity` and `SeverityBadge` ignored inherited severity, so a declared Low child with inherited Critical severity remained Low.

## Proof

Exact specialized snapshot command:

```text
git diff --binary --full-index 4b825dc642cb6eb9a060e54bf8d69288fbee4904 e83928ed3c4d34fd51039c65b3d86373687cb259 -- <four initial docs control files> <application board mirror> <starting scoring.ts> <starting SeverityBadge.tsx>
```

The full seven-path output is [before.patch](./before.patch), SHA-256 `76ab66b707d0e39f9be77024fc68e7160312c0154ab44f233419cf7e42359807`. This is deliberately an empty-tree-to-base snapshot and must not be interpreted as a conventional implementation diff.

## Conclusion

The base proves the unsafe reservations, one ownership collision, incomplete severity behavior, and the single assignable ESC-120 lane without fabricating a failed agent run.
