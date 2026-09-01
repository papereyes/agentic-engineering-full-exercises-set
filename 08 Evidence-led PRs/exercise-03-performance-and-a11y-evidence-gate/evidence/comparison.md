# Performance and Accessibility Evidence

Source SHA: f08168d623b36ad079c544befbada93239c3eb2d

Route: /

Release decision: PASSED

## Before and after

Same conditions were used for the Before and After runs. The raw reports below are the Proof for the release decision.

| Metric | Protected baseline | After, pessimistic | Required |
| --- | ---: | ---: | ---: |
| Performance | 0.82 | 1.00 | >= 0.90 |
| Accessibility | 0.91 | 1.00 | = 1.00 |
| LCP | 3380 ms | 1355 ms | <= 2500 ms |
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
| run-1.json | 937ac085b12e98f2c3b33751659033e5e83ca4bf8ebdc2e7c54f2b8d5b0038da | 1.00 | 1.00 | 1355 ms |
| run-2.json | fc0464230540f585f7e29f16483fc3978bc16dcdfd5113b01ed9318649bb08ba | 1.00 | 1.00 | 1352 ms |
| run-3.json | 7b43bde7c55c3fcd3acbfa58b2ba0e325f5d2ee5adbf1d0aa5f39867dbee49de | 1.00 | 1.00 | 1352 ms |

Axe artifact SHA-256: 40033ca7df3b79fdf12c5b7296b00b432abdf64c6e7db4480fe0130192dcc538

## Failure-path proof

The protected verifier changes one Lighthouse run below the performance threshold and injects one axe violation. The submitted gate must write a failed decision and return non-zero for both cases.

## Residual risk

Lighthouse results can vary across hardware even with pessimistic aggregation. Automated axe checks do not replace keyboard, screen-reader, zoom, or usability review. Re-run this gate in the review environment and complete focused manual accessibility checks before release.

## Conclusion

The After run passes the protected pessimistic gate; the Before baseline does not.
