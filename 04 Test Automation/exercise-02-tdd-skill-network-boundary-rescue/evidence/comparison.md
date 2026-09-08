# Comparison

## Same conditions

Both first attempts started at `52090edddf032d026ece16ef90feb627bf8e67ac` with the same prompt, agent, model, other tools, permissions, 45-minute limit, zero hints, and zero retries. The TDD skill was the only changed input. The changed files were the same three files in each implementation, with the same measured total: 92 insertions and 7 deletions.

This is a fair comparison of implementation order at the same public seam, with the same coverage target and verification boundary.

## Before

The repository-only attempt reached equivalent loading, success, server-empty, filtered-empty, request-error, and retry coverage, but it did not preserve test-before-production checkpoints.

## After

The skill-guided attempt preserved three hashed red-before-green checkpoints and linked each to the corresponding test-only and production edits. Strict MSW isolation and shuffled stability cover the public seam.

## Proof and limitation

The original JSONL proves chronology, tree identity, and exit status, but its empty output fields cannot establish the reason for each red result. The separately labelled review mutation reruns show that the present tests fail for the intended loading, filtered-empty, and retry defects; they do not reconstruct or upgrade the original evidence. The complete fresh verifier transcript records an outer-wrapper exit code of 0.

## Conclusion

The measured implementation outcomes are similar. The defensible benefit of the skill here is disciplined edit ordering and auditable checkpoints, not a claim that it produced broader behavior or fewer changed lines.
