# Exercise 02 : Repeated Mistake to Repository Rule

## Your Mission

Your team repeatedly corrects the same coding-agent persistence mistakes in PR review. Your mission is to turn those repeated corrections into minimal repository guidance and test its effect on a fresh agent's first attempt.

Three mistakes recur across separate changes: display labels stored as identity, unnormalized status values, and ambient timestamps inside business logic. The proving task does not reveal these hidden conventions.

Compare the exact task before and after guidance, then keep only rules supported by repeated evidence. A correct baseline is a ceiling result, not a forced failure.

The duration for this challenge is 45 min or less.

## Project

[rule-hardening-app](./rule-hardening-app) contains the defective persistence boundary and protected patch grader. The [correction history](./docs/correction-history.json), [guidance contract](./docs/guidance-contract.md), and [proving task](./tasks/proving-change.md) are immutable.

## How To Go About It

1. Create two branches from the same starting commit. In the first branch, run the proving task in a fresh agent session without new guidance. Do not hint, correct, retry, or edit the patch. Save `evidence/before.md` and `evidence/before.patch`.

2. Map each proposed rule to at least two separate correction events. Do not create permanent guidance from one mistake or personal preference.

3. In the second branch, create a short `AGENTS.md` that routes persistence work to `.agent/persistence.md`. Keep stable-ID, canonical-status, injected-clock, and exception details only in the deeper file.

4. Commit the guidance without implementation code. Start a different fresh session from that commit using the same prompt, agent, model, tools, permissions, and time limit.

5. Preserve the unedited first patch in `evidence/after.patch`. If the baseline has defects, the guided result must remove them. If the baseline is already correct, use the ceiling-aware no-regression result. Identical correct patches are allowed in that case.

6. Agent-run patches must change only `filterPersistence.mjs`. Commit the successful after patch alone, then add one participant test in the next commit. The committed source must be identical to the graded patch.

7. Save `evidence/after.md`, comparison, rule map, history, and command output. Raise a focused PR from the second branch.

## Evidence

Submit:

- `AGENTS.md`, `.agent/persistence.md`, final implementation, and participant test.
- `evidence/before.md`, unedited `evidence/before.patch`, `evidence/after.md`, and unedited `evidence/after.patch`.
- Run metadata, `evidence/comparison.md`, `rule-map.md`, `history.json`, and automatically captured command output.
- Output from `npm run verify:exercise`.
- A focused pull request containing only this exercise.

From `rule-hardening-app`, run `npm run evidence:capture -- --output ../evidence/commands/rules-verify.txt -- npm run evidence:verify`. This records the command, commit, timestamps, output, and exit code without requiring its own output file. Then run `npm run verify:exercise` before raising the PR. It checks protected inputs, matched run evidence, application quality, rule support, concise guidance, patch authenticity, ceiling-aware grading, source identity, history, and required proof.

For the required before and after files, follow the [evidence instructions and template](./docs/evidence-template.md) and the repository [submission standard](../../docs/SUBMISSION_STANDARD.md).

## Completion Criteria

The challenge is complete when:

- Both sessions differ only by repository guidance and use unedited first-attempt patches.
- Every permanent rule is supported by repeated correction events.
- `AGENTS.md` remains concise and routes to non-duplicated focused guidance.
- The grader records either defect improvement or a valid ceiling no-regression result, finds zero after defects, and confirms final source equals the graded after patch.
- `npm run verify:exercise` passes and Git history separates guidance, the graded source patch, and the participant test.
