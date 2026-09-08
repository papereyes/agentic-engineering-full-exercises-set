# Incident Summary Skill Benchmark

Candidate skill SHA-256: `215530830a0d6e2404d8f69843e78bd8f720ac96ff935447be18a28369eaa3f2`

| Configuration | Train quality | Held-out quality | Held-out critical | Held-out variance | Mean tokens | Mean elapsed |
|---|---:|---:|---:|---:|---:|---:|
| without_skill | 0.0% | 16.7% | 16.7% | 37.3% | 36911 | 26.5s |
| starter_skill | 0.0% | 0.0% | 0.0% | 0.0% | 32981 | 28.0s |
| with_skill | 100.0% | 100.0% | 100.0% | 0.0% | 34738 | 27.6s |

## Package gate: PASS

Mode: quality-improvement; comparison baseline: without_skill

- PASS train-quality: 1.000 (>= 0.875)
- PASS held-out-quality: 1.000 (>= 0.875)
- PASS held-out-critical: 1.000 (= 1.0)
- PASS improve-over-no-skill: 0.833 (>= 0.10)
- PASS improve-over-starter: 1.000 (>= 0.10)
- PASS held-out-variance: 0.000 (<= 0.16)
- PASS token-cost: 0.941 (<= 1.50x no-skill)
- PASS elapsed-cost: 1.041 (<= 2.00x no-skill)
