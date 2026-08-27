# Performance and Accessibility Evidence

Source SHA: 00728a08f6114315fd2ac94d939a9ad64fe05306

Route: /

Release decision: PASSED

## Before and after

Same conditions were used for the Before and After runs. The raw reports below are the Proof for the release decision.

| Metric | Protected baseline | After, pessimistic | Required |
| --- | ---: | ---: | ---: |
| Performance | 0.82 | 1.00 | >= 0.90 |
| Accessibility | 0.91 | 1.00 | = 1.00 |
| LCP | 3380 ms | 1410 ms | <= 2500 ms |
| Axe violations | 1 | 0 | = 0 |

## Comparable environment

- Lighthouse runs: 3
- Aggregation: pessimistic
- Chrome major: 151
- Form factor: mobile
- Throttling: simulate
- Axe browser: chromium 151.0.7922.34
- Production route: /

## Raw artifact trace

| Artifact | SHA-256 | Performance | Accessibility | LCP |
| --- | --- | ---: | ---: | ---: |
| run-1.json | fa7c4ac46fc3034680c39aded06fc908d18e186a2ef531d288196589d3ac7214 | 1.00 | 1.00 | 1355 ms |
| run-2.json | dfec2773ff03a8065322b699de64e8eb3cc900536910092b9561fb9de7c53537 | 1.00 | 1.00 | 1353 ms |
| run-3.json | 475bbf971b71b660446f8214da13bdd9a9922cd556f56eead2e857388e6f0687 | 1.00 | 1.00 | 1410 ms |

Axe artifact SHA-256: 19702be58306292b5d7ff60546ef9dca4ec442e46c49b506a11f8716f06b92d5

## Failure-path proof

The protected verifier changes one Lighthouse run below the performance threshold and injects one axe violation. The submitted gate must write a failed decision and return non-zero for both cases.

## Residual risk

Lighthouse results can vary across hardware even with pessimistic aggregation. Automated axe checks do not replace keyboard, screen-reader, zoom, or usability review. Re-run this gate in the review environment and complete focused manual accessibility checks before release.

## Conclusion

The After run passes the protected pessimistic gate; the Before baseline does not.
