# Comparison

## Same conditions

Both first attempts started at `52090edddf032d026ece16ef90feb627bf8e67ac` with the same prompt, same agent, same model, same tools, same permissions, same time limit, zero hints, and zero retries. The Verification Before Completion skill was the only changed input.

## Before

The before implementation already ran all four required gate steps and already stopped after a non-zero result or process-spawn failure. Its 4-file patch measured 51 insertions and 10 deletions. The session verified focused provider tests but could not complete the Maven package step in its restricted execution environment.

## After

The after implementation also runs the same four gate steps. Its 4-file patch measured 52 insertions and 6 deletions. Relative to before, it makes spawn/non-integer-status diagnostics explicit and adjusts client/provider unknown-state messages; it does not add the four-step gate or basic fail-closed control flow, because those were already present.

## Proof

Claim coverage differs at the evidence boundary: the after run has fresh evidence for the client contract, client build, complete provider behavior and build, gate contract, and failure handling. The before Maven restriction was an execution-environment limitation, not evidence that its implementation lacked those steps. `final-verification.txt` records each gate step; `full-exercise-verification.txt` records the outer verifier and its clean-state result with Maven output redirected to `/tmp`.

## Conclusion

The defensible skill benefit is claim discipline and complete fresh evidence. The actual changed files and implementation behavior are closely comparable; no claim is made that the skill introduced the gate surfaces that already existed before.
