# Before/After Comparison

## Fair Conditions

Both first-attempt sessions started at `52090edddf032d026ece16ef90feb627bf8e67ac`, used Codex with `gpt-5.6-sol` at medium reasoning, the same tools, permissions, 30-minute limit, and exact product prompt. The baseline used the supplied repository; the treatment received `CONTEXT.md` and used the Domain Modeling skill. Neither received a correction or retry.

## Result

Both implementations selected the current policy source, kept the six relevant vocabulary concepts distinct, rejected billing ownership and legacy Growth eligibility, implemented all six authorization conditions, and passed all eight rule checks. The context model therefore did not improve first-attempt functional correctness in this run: the baseline was already correct.

The patches still capture a meaningful treatment difference. `before.patch` contains only the authorization implementation, while `after.patch` also contains the glossary and ADR that made the vocabulary, source hierarchy, context boundary, and rejected interpretations explicit. Verification confirms the treatment result and its reusable domain record, but the actual policy function is identical in both first attempts.
