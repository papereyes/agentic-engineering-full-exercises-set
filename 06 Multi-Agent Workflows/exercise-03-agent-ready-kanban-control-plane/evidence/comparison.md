# Comparison

| Concern | Before | After |
|---|---|---|
| Assignment safety | Three unready or terminal cards retained paths | Only ESC-120 was assigned; all reservations are released |
| Collision | ESC-120 and ESC-122 both held scoring | ESC-122 remains blocked without ownership |
| Board consistency | Seeded unsafe reservations | Documentation and application JSON mirrors match |
| History | No lane or reviewed merge | One lane commit from base, reviewed and merged with `--no-ff` |
| Behavior | Child incident rendered declared Low | Inherited Critical drives scoring and the badge |
| Deferred rule | ESC-122 lacked boost/cap | `RULE-ESC-122` remains explicit and unimplemented |
