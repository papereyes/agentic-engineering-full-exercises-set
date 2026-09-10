# Before: vulnerable cache behavior

- Starting commit: e134b7e7b3163db395144bfb163a06d24ad06507
- Implementation commit: 85c6e0d7bcbc409d2de25805819e7c68f01e4632
- Agent and model: Codex gpt-5.6-sol
- Tools and permissions: repository read, isolated fresh-review context, workspace-write test instrumentation
- Time limit: 60 minutes
- Human hints: 0
- Retries: 0
- Patch: evidence/before.patch
- Patch SHA-256: 6241a0d4f86e56344bf97aa688f1242036a3ada9cf929e765c3d74d88bf47f2f

The implementation commit adds only the four learner regression probes. Running the probes against the protected risky state produced four executed failures: invalid cache data rejected loading, default sorting mutated the fixture, saved drafts did not survive reload, and evidence collection overwrote cached workflow state. The protected component check separately reproduced cache deletion during filtering.

Fresh review context contained only docs/review-brief.md, fixtures/manifest.json, and pr/review-target.diff. The reviewer requested changes and reported the same four risk classes. The seeded claim that saveAction mutates the fixture was not accepted without reproduction.
