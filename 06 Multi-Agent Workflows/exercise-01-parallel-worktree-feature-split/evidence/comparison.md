# Comparison

## Same conditions

Both views use starting commit `e83928ed3c4d34fd51039c65b3d86373687cb259`, product head `a19966b482a23d9867f7553c404da881a064bfd6`, the 75-minute exercise limit, zero human hints, and zero benchmark retries. Snapshot commit `b152c10a251136d3f9e64a65b00e494dd0e4e5f3` is the last committed evidence state before hardening.

## Before

No comparable before-agent run exists. The baseline artifact is explicitly specialized: `before.patch` snapshots the starting product files from empty tree `4b825dc642cb6eb9a060e54bf8d69288fbee4904` to the base commit. The original dependency installation was not logged and has not been reconstructed.

## After

Three isolated lane commits share the base parent and remain reachable on their lane branches. Integration preserves B, A, C as three `--no-ff` merges, followed by the single shared-type commit. The accepted product changes 10 files by 108 insertions and 3 deletions.

Lane B has additional, honestly bounded chronology: reflog/Git objects show initial commit `476140c211104941db473467c4a00cd5f9a7a027` at 2026-09-09 13:03:17 +0530, stale integration merge `fdc1e8f504af7556da3cd15def21005495b4a396` at 13:04:05, accepted amended commit `1ac6bbdd195cdda94c08b00c5c6e49ac63a6736d` at 13:06:05, and accepted merge `f46c3e5d5933a270bfc87a361eb09253ddacef8f` at 13:06:33. The amendment made `dueToday` optional and rendered missing data as zero. No first-attempt command transcript survives, so none is claimed or reconstructed.

## Proof

| Concern | Evidence |
|---|---|
| Lane isolation | Git parent/path checks in `lane-handoffs.json`; exact accepted SHAs are rerun in `commands/lane-a.txt`, `lane-b.txt`, and `lane-c.txt` |
| Conflicts/shared ownership | No textual merge conflict; FilterPreset and EvidenceBundle were promoted only by shared commit `a19966b482a23d9867f7553c404da881a064bfd6` |
| History | Merge parents bind B `f46c3e5d5933a270bfc87a361eb09253ddacef8f`, A `8bbb3af507abc043cb63f649a5593d764373698b`, then C `32a26da5b14c1aa27ba545ab4e0f379e8552698f` |
| Behavior | Focused reruns each pass 3/3; integrated rerun passes 9/9 |
| Full exercise gate | `commands/verify-exercise.txt`, captured at `b152c10a251136d3f9e64a65b00e494dd0e4e5f3`, ends with `COMMAND_EXIT_CODE="0"` |
| Untrusted input | UNTRUSTED-01 remains rejected for parent, changed-path, and missing-output mismatches |
| Patch binding | Before SHA-256 `58a82e3285de0923528d1ef4709aa7fc71544f963836f9fab712f9293add9692`; after SHA-256 `e875756aa2186d2a6ab6b67c2b175f99f9b931258e40fc4f30e0116e1b949a45` |

## Conclusion

The specialized baseline, exact product diff, Git topology, and fresh exact-SHA reruns provide reproducible evidence without pretending that missing original install or first-attempt logs exist.
