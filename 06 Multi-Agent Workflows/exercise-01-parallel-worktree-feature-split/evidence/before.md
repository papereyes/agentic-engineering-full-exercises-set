# Before

## Same conditions

- Starting commit: `e83928ed3c4d34fd51039c65b3d86373687cb259`
- Snapshot commit: `b152c10a251136d3f9e64a65b00e494dd0e4e5f3`
- Product head: `a19966b482a23d9867f7553c404da881a064bfd6`
- Agent and model: three delegated lane agents (Faraday, Carson, and Sartre) plus the integration owner; model identifiers were not retained in the original record.
- Tools and permissions: Git worktrees, Git history inspection, npm, and repository read/write access.
- Time limit: 75 minutes.
- Human hints: 0.
- Retries: 0.

## Before

There was no comparable before-agent run. `before.patch` is therefore a specialized baseline snapshot: the complete starting product tree represented as an add-from-empty Git diff, not an agent-produced implementation diff.

- Empty tree: `4b825dc642cb6eb9a060e54bf8d69288fbee4904`
- Baseline target: `e83928ed3c4d34fd51039c65b3d86373687cb259`
- Exact command: `git diff --binary --full-index 4b825dc642cb6eb9a060e54bf8d69288fbee4904 e83928ed3c4d34fd51039c65b3d86373687cb259 -- "06 Multi-Agent Workflows/exercise-01-parallel-worktree-feature-split/worktree-feature-app"`
- Patch SHA-256: `58a82e3285de0923528d1ef4709aa7fc71544f963836f9fab712f9293add9692`

The initial worktree state is retained verbatim in `worktree-list-before.txt`. All three lane branches began at the same base. Lane A owned FilterBar, filters, and tests/lane-a; Lane B owned MetricStrip, scoring, and tests/lane-b; Lane C owned EvidencePanel, workflowApi, and tests/lane-c. The original record states that `npm run agent:check` passed before lane work; its original transcript was not retained, so this evidence does not present a reconstructed output.

## Proof

The patch header and full-index blob identifiers bind the baseline artifact to the Git object database. The original dependency-install transcript was not retained, so none was reconstructed. The later exact-SHA reruns reused the already-installed dependency tree through temporary worktree-local `node_modules` links, as labelled in each command artifact.

## Conclusion

`before.patch` is honest starting-state proof for this specialized multi-lane exercise; it is not presented as a comparable agent run.
