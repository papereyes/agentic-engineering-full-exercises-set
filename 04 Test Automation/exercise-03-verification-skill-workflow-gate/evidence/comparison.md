# Comparison

The experiment used the same prompt, same agent, same model, same tools, same permissions, and same time limit. The Verification Before Completion skill was the only changed input, and both were first attempts from the same base.

Claim coverage improved from a focused provider check to client contract, client build, complete provider behavior, provider build, and gate contract. Failure handling now stops on non-zero or process-spawn failure instead of allowing unsupported completion.

Fresh evidence came from the committed implementation's complete gate. Changed files were the gate, client parser, provider response record, and provider service; no unrelated production files changed.
