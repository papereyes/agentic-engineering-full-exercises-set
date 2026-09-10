# Before and after comparison

## Same conditions

Both attempts start at `87faeacd84a19a7306e4c2461d1a0f705bd4e6e6` and use the same five learner-owned regression tests. The before implementation commit contains only those probes, so replaying it against the vulnerable state demonstrates that every asserted behavior is genuinely absent. The after implementation commit contains the probes plus the production corrections, making the result attributable to the remediation rather than to different test coverage.

The review covered more than scanner output. Semgrep correctly identified untrusted reviewer notes flowing into `dangerouslySetInnerHTML`, but it also reported `SafeAnnouncement`, where a module-local constant is the only input. The review confirms the first finding and records reproducible dismissal proof for the second. Manual tracing found the remaining workflow, validation, policy, and accessibility regressions that a sink-focused rule cannot discover.

## Conclusion

The fixes stay at their owning boundaries. Display escaping remains in React's normal text rendering; the composer preserves the user's selected status and client affordances; the native button supplies keyboard semantics; and the server policy remains the authoritative enforcement point even for direct callers. The replay uses the identical regression file against vulnerable and fixed states, producing five failures before and five passing probes after. This combination provides a stronger merge decision than either static analysis or an after-only green test run.
