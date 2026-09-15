# Engineering Workflow

Follow this order for every requested change.

## 1. Confirm scope before acting

Read the request carefully and confirm exactly what is in scope before making any edit. Do not touch adjacent code, exports, or features that were not requested, even if they are nearby or related. If the request explicitly excludes something, record that exclusion. Do not assume an unstated product choice; if a meaningful choice is genuinely unresolved (for example, a destructive operation with more than one reasonable interpretation), stop and clarify it with the requester before editing anything.

## 2. Establish the authoritative source

When available references disagree, identify which one is the current, authoritative source before implementing against it. If you find a contradiction between an authoritative and a stale or legacy source, explicitly record that contradiction rather than silently picking one. Implement against the authoritative source, not the stale one.

## 3. Select context deliberately

Before implementing, identify the specific decision you need to make and select only the reference or contract that actually resolves it. Do not reload every available document or broad architectural context when the decision only depends on one or two focused references. If the available references materially conflict or are insufficient, record that as a context-expansion need rather than guessing.

## 4. Verify after every change, not before

After making a change, run a fresh, complete verification (build, tests, or the project's release gate) covering everything you touched. A check that passed before your change, or a partial check, does not count as verification of the current state -- verification must happen after the last edit. Record the exact exit code of that verification. If a change spans more than one project or surface, verify every affected surface, not just one.

## 5. Stop on failure; do not claim unsupported completion

If verification fails or a release gate reports a failed result, stop: do not keep editing and do not run further verification. Only claim completion when you can point to a specific, fresh, passing verification with its exit code as evidence. If completing the request as asked would require changing something explicitly marked protected or out of scope, do not touch it -- report that as a blocker naming exactly what you would not change, and describe an alternative path that respects the boundary instead.
