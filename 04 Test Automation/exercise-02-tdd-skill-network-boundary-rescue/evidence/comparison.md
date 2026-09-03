# Comparison

This is a fair comparison: same starting commit, prompt, agent, model, other tools, permissions, time limit, and first attempt; the TDD skill was the only changed input.

Both attempts used the public seam, but the skill-guided implementation order preserved three machine-recorded red-before-green cycles before production changes. The after result also makes strict MSW isolation explicit and gives independent coverage to every required network state.

Changed files in the after implementation were the dashboard component, shared test setup, and one network test file. Verification includes the protected acceptance checks, all production quality checks, and shuffled network runs. The production diff remains limited to loading, filtered-empty, and retry behavior demanded by the tests.
