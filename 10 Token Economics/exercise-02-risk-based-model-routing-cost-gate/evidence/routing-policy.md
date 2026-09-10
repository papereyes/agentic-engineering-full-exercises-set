# Field-based routing policy

The router reads only three explicit task fields: `risk`, `ambiguity`, and `scope`. It does not infer risk from prose. Accepted risk and ambiguity values are `low`, `medium`, and `high`; accepted scope values are `one-file`, `three-files`, `mechanical`, and `cross-boundary`. A missing or unknown field returns `clarify`, making incomplete classification a non-executing decision.

Precedence is deterministic:

1. Missing fields, unknown values, or `ambiguity: high` route to `clarify`.
2. `risk: high` or `scope: cross-boundary` routes to `reasoning`.
3. `risk: medium` or `scope: three-files` routes to `balanced`.
4. A low-risk, low-ambiguity `one-file` or `mechanical` task routes to `fast`.
5. Any valid but uncovered combination routes to `clarify`.

This precedence is also the tie-break rule. For example, a cross-boundary task wins the reasoning rule even if another field appears cheap, while high ambiguity wins clarification before risk-based execution. The ordering prevents a lower-cost rule from overriding a stronger safety signal.

Evaluation uses the protected `routing-measurements-v1` offline benchmark. Fast and balanced calls that miss the case quality floor or fail safety receive a single retry at the next tier: fast escalates to balanced, balanced escalates to reasoning, and reasoning stays reasoning. The cost model pairs retry run N with initial run N so correlation is preserved. Clarify produces no model call until the missing field is supplied; it is not treated as a cheap successful execution.

No heuristic text parser, learned classifier, provider API, or new dependency is needed. The bounded field contract is auditable and the protected held-out cases exercise fast, balanced, reasoning, clarify, unknown values, and cross-boundary precedence.
