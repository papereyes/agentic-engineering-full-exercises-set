# Regression review evaluation

## Baseline

The three Baseline runs were captured without the reusable skill. Historical Coverage and Security Coverage were both 1.0. Precision was 0.7777777778 because seven supported rules appeared among nine blocking findings. Clean control accuracy was 1.0 because the conforming immutable-sort refactor was approved.

## Skill-assisted

The three Skill-assisted runs used the same agent, model, adapter, protected diffs, prompts, permissions, and time limits, with only the hardened skill added. Historical Coverage remained 1.0, Security Coverage remained 1.0, Precision rose to 1.0, and Clean control accuracy remained 1.0.

## Why the result changed

The skill requires an explicit acceptance-rule checklist, traces each changed decision through callers and observable state, and asks for before-state reproduction. It directs filter reviews to exercise wildcard and category choices instead of sampling one path. Its output contract requires one exact changed-line code anchor and one finding per distinct rule or root cause. Those constraints preserve completeness while preventing duplicate blockers. Explicit dismissal guidance preserves the clean approval path instead of rewarding noisy output.

## Decision

All gates pass: historical and security coverage are complete, precision is at least 0.8, the clean control is approved, and no metric regresses. Decision: `adopt` the reusable regression-review skill.
