# Training Trigger Analysis

The original description produced three majority-vote training false positives—`train-release`, `train-pr-summary`, and `train-review-advice`—and no training false negatives. Eleven of twelve training cases were unanimous. The broad wording treated release communication, PR writing, and general review guidance as change review.

The boundary problem was structural: “review and summarize changes when someone wants feedback” does not identify review artifacts, outcomes, or non-use cases. The description was repaired from those training failures plus the protected catalog boundary and validator contract, not from held-out phrasing. It now names existing code artifacts and defect/merge-risk outcomes, and explicitly excludes implementation, debugging, release communication, incident reporting, summary/design/advice work, and combined independent workflows.

The description was frozen before the after evaluation. No description change was made in response to any after or held-out failure.
