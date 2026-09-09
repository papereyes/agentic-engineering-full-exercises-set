# Comparison

| Area | Before | Decision and after |
|---|---|---|
| Security | Active note HTML and service bypass | Fixed text rendering and service-boundary actor/evidence checks; CLAIM-01 dismissed |
| Accessibility | Clickable div rows | Native buttons with aria-pressed |
| Performance | 150,000 reductions and render-time recalculation | One reduction plus reviews-keyed memoization |
| Testability | Browser timer and real delay | Platform-neutral default with injected wait |
| Checks | Four focused failures | Four fresh focused passes |
| Performance | 292.826 ms | 0.067 ms for the identical protected scenario |
| Merge readiness | Blocked | Approved after every blocker passed recheck |
