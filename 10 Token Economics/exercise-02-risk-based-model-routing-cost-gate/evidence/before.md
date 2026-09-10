# Before: all-reasoning routing

- Starting commit: `e134b7e7b3163db395144bfb163a06d24ad06507`
- Implementation commit: `aafe97befc9fdbdc63c94ebe904eb6bfd22436ac`
- Agent and model: Codex, `gpt-5.6-sol`, medium reasoning
- Tools and permissions: workspace-write repository session with shell and protected offline fixtures
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/before.patch`
- Patch SHA-256: `00d6f1f1dda6e03105649f33c51b5899a8dbea73fc10f7421176071d0ab73b0d`

Pack digest: `a854cf95252f93d1338ed1223ab6d9ae926c4d812a6951b18f5856c4a62ebe9e`. The fixed benchmark uses three runs per eligible lane. The all-reasoning expected cost is USD 0.1001933333 across six executable cases, with approximately 15,072 ms aggregate expected latency, zero selected quality or safety failures, and zero clarification decisions.
