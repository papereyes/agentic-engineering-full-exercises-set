# Adoption decision

Decision: **adopt** the field-based router for the benchmarked task contract.

The quality gate passes: every executable case has a selected-lane mean at or above its case floor. Fast cases average 0.8866666667, balanced cases average 0.92, and reasoning cases average 0.98. Four individual low-cost observations fall below their floor, but the benchmark prices their required single retry and still passes the aggregate quality rule. The maximum observed quality variance range is 0.15 for fast, 0.11 for balanced, and 0.02 for reasoning, so the decision does not hide run-to-run variance.

The safety gate passes with zero safety failures on every selected route. High-risk and cross-boundary cases go directly to reasoning, while high ambiguity, missing fields, and unknown classifications clarify before execution. These rules keep the cost optimization subordinate to explicit safety classification.

The cost gate passes. Policy expected cost is USD 0.048863 versus USD 0.1001933333 for the all-reasoning benchmark, a measured savings percentage of 51.2312861801. That exceeds the protected minimum savings threshold of 25%. Expected policy latency totals 11,520 ms across the eight cases, including correlated retry latency; the comparable all-reasoning execution surface is approximately 15,072 ms across the six executable held-out cases.

The benchmark consists of 36 protected offline observations with response hashes, input/output tokens, latency, quality, safety, and grading rationale. It is a deterministic synthetic benchmark and explicitly not production-provider telemetry. All measurements reconcile to the fixed pricing table, all protected hashes match, all case routes match, and completeness passes without an API key.

Adoption is limited to tasks that supply the three documented fields. Production monitoring should revisit the decision if real quality, safety, latency, retry frequency, provider pricing, or workload mix diverges materially from this held-out benchmark. Within the exercise evidence, every route, quality, safety, completeness, and savings gate passes, so adopt is the reproducible result.
