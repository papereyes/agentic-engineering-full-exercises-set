# Verification plan

| Requirement | Command | Expected result |
|---|---|---|
| gate failure stops later work and preserves status | `npm run test:gate` | success, non-zero, and spawn-error contracts pass |
| client requires valid `decisionState` | `npm run test:release` | missing and unknown states are rejected |
| client quality and build | `npm run agent:check` | tests, types, and Vite build pass |
| complete provider behavior and build | `./mvnw -q verify` | all tests plus Maven packaging pass |

The provider check includes every mapped decisionState and rejects an unknown transition before persistence. The single gate invokes each command once; any command failure stops the remaining steps.
