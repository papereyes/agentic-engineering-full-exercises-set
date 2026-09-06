# Exercise 01 : Trace-Measured Session Waste Reduction

## Your Mission

Your team knows coding-agent sessions are wasting time and tokens, but its analyzer labels useful work as waste. Your mission is to correct the measurement, remove the largest preventable behavior, and prove the improvement in a comparable fresh replay.

The trace contains repeated failed commands without diagnosis, an oversized context load, and a completion claim after code changed without final verification. First reads, changed-file rereads, and useful failures must not be misclassified.

Use event-level evidence to choose one executable workflow improvement and measure its effect.

The duration for this challenge is 45 min or less.

## Project

[session-waste-app](./session-waste-app) contains the seeded analyzer and protected tests. The [implementation request](./tasks/implementation-request.md), [metric contract](./docs/metric-contract.md), [baseline trace](./docs/session-events.json), [session conditions](./docs/session-metadata.json), and [POLICY-217 replay brief](./tasks/policy-217-replay.md) are immutable inputs. The original POLICY-217 application is not included, so its event replay is explicitly constructed rather than presented as a live provider trace.

## How To Go About It

1. Create two branches from the same starting commit. In the first branch, give a fresh coding agent the supplied implementation request without your trace analysis or corrections. Commit its first attempt and save `evidence/before.md` and `evidence/before.patch`.

2. Run the protected baseline through the supplied analyzer. Review the first attempt and classify an event as preventable only when it is a same-version duplicate read, an identical failed command repeated before diagnosis or workspace change, or a context load above 8,000 bytes.

3. In the second branch, start a fresh agent under the same agent, model, tools, permissions, request, time limit, and first-attempt conditions. Use your trace findings as repository evidence. Correct the analyzer so first reads, reads after a file changes, diagnosed retries, and useful failures are not counted as waste. A passed final verification must occur after the last write.

4. Implement `preflightPolicy.mjs` so a failed command cannot repeat at the same workspace revision until a diagnosis event or revision change. Add participant tests.

5. Commit only the analyzer, preflight, and test as one focused source commit. Save it as `evidence/after.md` and `evidence/after.patch`. Identical correct implementation patches are allowed, but the trace analysis and replay proof are still required.

6. Use the supplied POLICY-217 brief to construct a new replay under the fixed simulated agent, model, prompt, and time limit. Give every event a unique ID, the replay session ID, and an ordered timestamp. Do not copy or splice the protected baseline.

7. Save after metrics, retrospective, replay report, history, and comparison. Raise a focused PR from the second branch containing the executable improvement and proof.

## Evidence

Submit:

- The corrected analyzer, executable preflight, and participant test.
- `evidence/before.md`, `evidence/before.patch`, `evidence/after.md`, and `evidence/after.patch`.
- Baseline and replay events, metadata, generated metrics, retrospective, replay report, history, and `evidence/comparison.md`.
- Automatically captured command output and output from `npm run verify:exercise`.
- A focused pull request containing only this exercise.

From `session-waste-app`, run `npm run evidence:capture -- --output ../evidence/commands/retro-verify.txt -- npm run evidence:verify`. This records the command, commit, timestamps, output, and exit code without requiring its own output file. Then run `npm run verify:exercise` before raising the PR. It checks protected inputs, matched run evidence, application quality, event classifications, retry policy, replay provenance, measured waste reduction, final verification timing, and required proof.

For the required before and after files, follow the [evidence instructions and template](./docs/evidence-template.md) and the repository [submission standard](../../docs/SUBMISSION_STANDARD.md).

## Completion Criteria

The challenge is complete when:

- Baseline and constructed replay conditions match, replay events are session-bound and fresh, and all metrics are derived from raw events.
- Event classifications follow the metric contract and useful work is not counted as preventable waste.
- The executable preflight blocks an unchanged failed-command retry until diagnosis or revision change.
- Unchanged retries reach zero, preventable calls fall by at least two, and final verification passes after the last write.
- `npm run verify:exercise` passes and the source commit remains focused.
