# Cache review comparison

## Same conditions

Before and After use starting commit e134b7e7b3163db395144bfb163a06d24ad06507, Codex gpt-5.6-sol, the same 60-minute limit, the same protected comparison, and the same four learner regression probes. The independent reviewer received only the three files listed in reviewer-session.json.

## Before

Filtering called clearCachedWorkflowItems and erased saved state. JSON.parse trusted malformed and non-array browser data. workItems.sort changed the imported fixture. saveAction returned updated fields without storing them. collectEvidence overwrote cache during a read-only operation. The learner suite executed four failing assertions, while the protected component check reproduced filter deletion.

## After

Filtering changes view state only. A single cache reader catches parse failures, rejects non-arrays, and clears damaged state. Default data is copied before sorting. saveAction persists a copied updated list, and collectEvidence has no cache side effect. Nine focused cache tests pass.

## Proof

CACHE-LIFECYCLE maps to App.tsx, saveAction, the protected filter test, and the named reload regression. CACHE-VALIDATION maps to the malformed/non-array regression. CACHE-MUTATION maps to the fixture-order regression. CACHE-EVIDENCE maps to the sentinel-cache regression. CLAIM-MUTATION is dismissed because the protected head returns a spread object without mutating workItems. before.patch and after.patch bind these states to their recorded commits.

## Conclusion

The remediation fixes every reproduced blocker at the cache ownership boundary without unrelated refactoring. The unsupported mutation claim remains dismissed, so the repaired change is suitable for re-review.
