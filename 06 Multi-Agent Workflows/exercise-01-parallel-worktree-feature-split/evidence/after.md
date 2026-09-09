# After

## Same conditions

- Starting commit: `e83928ed3c4d34fd51039c65b3d86373687cb259`
- Snapshot commit: `b152c10a251136d3f9e64a65b00e494dd0e4e5f3`
- Product head: `a19966b482a23d9867f7553c404da881a064bfd6`
- Agent and model: three delegated lane agents (Faraday, Carson, and Sartre) plus the integration owner; model identifiers were not retained in the original record.
- Tools and permissions: Git worktrees, Git history inspection, npm, and repository read/write access.
- Time limit: 75 minutes.
- Human hints: 0.
- Retries: 0.

## After

- Lane commits: A `cb2fc176ea2c27f40e34e6959e35b36c557199cd`, B `1ac6bbdd195cdda94c08b00c5c6e49ac63a6736d`, C `93adf67a1d20d19151d91d129d54e75c49738c81`.
- Merge commits in required first-parent order: B `f46c3e5d5933a270bfc87a361eb09253ddacef8f`, A `8bbb3af507abc043cb63f649a5593d764373698b`, C `32a26da5b14c1aa27ba545ab4e0f379e8552698f`.
- Shared-type commit and product head: `a19966b482a23d9867f7553c404da881a064bfd6`.
- Product delta: 10 files, 108 insertions, and 3 deletions.
- Exact patch command: `git diff --binary --full-index e83928ed3c4d34fd51039c65b3d86373687cb259 a19966b482a23d9867f7553c404da881a064bfd6 -- "06 Multi-Agent Workflows/exercise-01-parallel-worktree-feature-split/worktree-feature-app"`.
- Patch SHA-256: `e875756aa2186d2a6ab6b67c2b175f99f9b931258e40fc4f30e0116e1b949a45`.

## Proof

Each lane command artifact is a complete post-integration rerun from a detached worktree at the exact accepted lane commit; `commands/integrated.txt` is the equivalent rerun at the exact product head. All four commands exited 0, with 3/3 tests in each focused lane and 9/9 tests in the integrated run.

Before this evidence-hardening commit, `npm run verify:exercise` ran from snapshot commit `b152c10a251136d3f9e64a65b00e494dd0e4e5f3` and exited 0. Its complete unedited terminal transcript, including the command and generated exit-code footer, is `commands/verify-exercise.txt` (SHA-256 `5f77a44c6349dbcdd5a35c487053e36971a251755ed5726d86383721d4fb7f8d`).

## Conclusion

The exact product diff, accepted history topology, exact-SHA reruns, and pre-hardening full verifier transcript agree. Linked lane worktrees were removed after the original review; temporary detached rerun worktrees are not claimed as original lane worktrees.
