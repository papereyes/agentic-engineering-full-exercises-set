# Three-Lane Comparison

All 36 runs used the same agent, model, tools, permissions, prompt per eval, repository commit, time limit, and first-attempt condition. Only the skill configuration changed.

| Lane | Train | Held-out | Critical | Held-out variance | Mean tokens | Mean elapsed |
|---|---:|---:|---:|---:|---:|---:|
| without_skill | 0% | 16.7% | 16.7% | 0.373 | 36,911 | 26.5s |
| starter_skill | 0% | 0% | 0% | 0.000 | 32,981 | 28.0s |
| with_skill | 100% | 100% | 100% | 0.000 | 34,738 | 27.6s |

The quality-improvement gate passed: candidate held-out quality improved by 83.3 points over no skill and 100 points over the starter, all critical assertions passed, token use was 0.941× no skill, and elapsed time was 1.041× no skill. Packaging is allowed because every generated common and comparison check passed.
