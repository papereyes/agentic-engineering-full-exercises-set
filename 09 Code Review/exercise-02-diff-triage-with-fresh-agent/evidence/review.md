# Independent cache diff review

Base SHA: 8911d1064f74bdc7f0d4e88a2e57f122830ef6f2

Head SHA: 8242a84ad8735d1a9c5051e1916d86c1c95101af

Comparison: review-base..review-head

Source SHA: 67529fe614240f569c16a0f2ee03e848442b3d43

Merge decision: Request changes

The protected head must not merge until the confirmed cache blockers below are repaired. The report comes from a fresh review followed by direct reproductions; severity reflects observable loss or corruption of workflow state rather than the implementer's stated intent.

## Confirmed blockers

### CACHE-LIFECYCLE — high confidence, high severity

Anchor: clearCachedWorkflowItems();

Changing a priority or status filter invokes a cache-deletion effect, including once on initial mount. In the same caching design, saveAction returns a new item but never refreshes localStorage. A reviewer can save an owner, status, and note, filter the queue, reload, and receive the old fixture values. The fix removes persistence work from the filter effect and makes saveAction write a copied updated list. Regression: tests/cache-regressions.test.ts names CACHE-LIFECYCLE; the protected App test separately proves filters never delete persisted data.

### CACHE-VALIDATION — high confidence, high severity

Anchor: return JSON.parse(cached) as WorkItem[];

Malformed JSON throws from fetchWorkItems, and valid non-array JSON passes through a compile-time assertion without runtime validation. Either case can keep the workspace from loading usable array data. The focused reproduction tries malformed and object-shaped values, expects a safe source-data fallback, and confirms damaged cache removal. The fix catches parsing failures and accepts only arrays. Regression: tests/cache-regressions.test.ts names CACHE-VALIDATION.

### CACHE-MUTATION — high confidence, medium severity

Anchor: return workItems.sort((left, right) => left.dueInDays - right.dueInDays);

The default path invokes the mutating Array.sort method directly on the imported fixture. Subsequent consumers therefore observe reordered shared data instead of an immutable source fixture. The reproduction reverses the fixture, calls fetchWorkItems, and checks both ordered output and unchanged input. The fix sorts a shallow copy. Regression: tests/cache-regressions.test.ts names CACHE-MUTATION.

### CACHE-EVIDENCE — high confidence, high severity

Anchor: window.localStorage.setItem("workflow-items", JSON.stringify(workItems));

Evidence collection is specified as read-only, but the protected head overwrites browser state with the source fixture. Any saved values absent from that fixture are lost. The reproduction stores a sentinel payload, collects evidence, and observes the vulnerable write. The fix removes the write entirely. Regression: tests/cache-regressions.test.ts names CACHE-EVIDENCE.

## Dismissed claim

### CLAIM-MUTATION — high confidence dismissal

Anchor: export async function saveAction(itemId: string, draft: ActionDraft): Promise<WorkItem> {

The supplied claim says saveAction mutates workItems in place. Inspection and reproduction do not support it: the protected function finds an item and returns a new spread object without assigning into the array or item. The real defect is missing cache persistence, not fixture mutation. Dismissal proof is recorded in review.json, and no fix or learner test is attributed to this unsupported claim.

## Regression and re-review

All four confirmed finding IDs execute against the same learner test file. They fail as assertions on the protected risky head and pass on the remediation. The protected acceptance and App behavior tests cover the same trust, lifecycle, immutability, persistence, and read-only boundaries. Re-review may approve after verifying the source SHA and evidence-only follow-up history.
