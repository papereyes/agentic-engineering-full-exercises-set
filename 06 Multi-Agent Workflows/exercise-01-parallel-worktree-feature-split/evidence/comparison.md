# Comparison

| Concern | Planned | Actual |
|---|---|---|
| Lanes | Three branches from one base | A, B, and C each produced one commit from `e83928ed3c4d34fd51039c65b3d86373687cb259` |
| Ownership | No lane crosses its three path prefixes | All changed paths matched the declared ownership maps |
| Conflicts | Shared types deferred to integration | No textual merge conflicts; FilterPreset and EvidenceBundle were promoted in one shared-type commit |
| History | Merge B, A, C with `--no-ff` | Three inspectable merge commits preserve exact lane blobs |
| Behavior | Saved filter, due-today metric, evidence export | All 9 integrated tests pass |
| Untrusted input | Verify claims before merge | UNTRUSTED-01 was rejected for parent, path, and output mismatches |
