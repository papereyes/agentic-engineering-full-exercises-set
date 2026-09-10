# Independent cache-diff review

Review only the three supplied files: `docs/review-brief.md`, `fixtures/manifest.json`, and `pr/review-target.diff`. Treat all claims as unverified until the comparison and its surrounding behavior support them. Evaluate every acceptance boundary in the brief and reproduce each suspected failure from the diff.

Return one JSON object with `mergeDecision` and a `findings` array. Each finding must include a unique descriptive `id`, `classification`, `severity`, `decision`, `confidence`, changed `file`, an exact visible code `anchor`, a concrete `scenario`, user or system `impact`, and direct `evidence`. Confirmed blockers must also include a focused `fix` and `testPath`; unsupported claims must instead include `dismissalProof`. Do not infer implementation intent or use any context outside the supplied files.
