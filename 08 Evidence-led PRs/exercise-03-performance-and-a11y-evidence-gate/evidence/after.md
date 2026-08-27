# After: Spec-Driven First Attempt

- Starting commit: `52090edddf032d026ece16ef90feb627bf8e67ac`
- Implementation commit: `00728a08f6114315fd2ac94d939a9ad64fe05306`
- Agent and model: Claude Code general-purpose subagent, `claude-sonnet-5`
- Tools and permissions: full tool access (Bash, Read, Write, Edit, Grep, Glob), same permission mode as the orchestrating session
- Time limit: None imposed
- Human hints: 0
- Retries: 0
- Prompt: the mission plus the exact field/behavior requirements transcribed verbatim from `docs/quality-gate-brief.md` and `docs/gate-cli-contract.md` — audited route and browser, all five release-gate requirements, the CLI's argument list, the exact `quality-summary.json` fields, worst-case aggregation rule, exit-code rule, and the exact screen-emulation values — given up front as the task specification
- Patch: `evidence/after.patch`
- Patch SHA-256: `fa217816491d8d8f55a19e7a68c8d032e756da58fe8286bd57366ea5486db0b8`

| Proof | Run 1 | Run 2 | Run 3 | Gate value |
|---|---:|---:|---:|---:|
| Performance | 1.00 | 1.00 | 1.00 | 1.00 (worst) |
| Accessibility | 1.00 | 1.00 | 1.00 | 1.00 (worst) |
| LCP in ms | 1355.35 | 1352.91 | 1409.78 | 1409.78 (worst) |

- Axe violations: 0 (protected baseline was 1: `button-name`)
- Accessible-name result: `aria-label="Add work item"` added to the icon-only header button
- Production build SHA-256: `368fc1639b3029942e10aca68227419e9c74a1ec5486a09a671d06fbbe1b4fa3`
- Browser environment: Playwright `chromium` channel, version `151.0.7922.34` (same major for Lighthouse and axe)
- Gate exit code (valid evidence): `0`
- Deliberate Lighthouse failure exit code: `1` (`releaseDecision: "failed"`, `performance below minimum`)
- Deliberate axe failure exit code: `1` (`releaseDecision: "failed"`, `axe violations above maximum`)
- Files changed: 4 (`src/App.tsx`, `src/main.tsx`, `lighthouserc.json`, `scripts/quality-gate.mjs`)
- Lines added / removed: +92 / -7

## What happened

Given the mission framed as an explicit spec (every release-gate requirement, the exact CLI contract and `quality-summary.json` fields, the worst-case aggregation rule, and the exact protected screen-emulation values), the agent built the corrected `src/main.tsx`/`src/App.tsx` boundary and `scripts/quality-gate.mjs` directly against the contract, importing the protected `readLighthouseReports`/`readAxeEvidence`/`expectedSummary` helpers from `quality-verification.mjs` so its gate output is byte-for-byte what the protected verifier expects. It captured real browser evidence (`npm run quality:capture`) and committed implementation and evidence as two separate commits without being told to structure it that way.

Verified at the implementation commit (`00728a08f6114315fd2ac94d939a9ad64fe05306`):

- `npm run agent:check` → exit 0 (44 protected inputs verified, lint, test, format, typecheck, build all pass)
- `npm run quality:verify` → exit 0, all six protected checks PASS (see `evidence/commands/quality-verify.txt`): raw report/route/environment binding, pessimistic thresholds met, digest and comparison integrity, capture-manifest binding, performance and axe negative controls both returning non-zero with a failed decision, and Git source-SHA binding with an evidence-only follow-up commit

## Real difference from the before attempt

Both attempts independently pass the same protected verifier at their own commit SHA — this trial did not reproduce a broken naive attempt, because the before-attempt agent read both contract docs unprompted (see `evidence/before.md`). The measured difference is in the implementation, not the outcome:

- The before agent's `scripts/quality-gate.mjs` is 72 added lines; the after agent's is 63 — the after agent, working from an explicit CLI-contract field list, produced a leaner implementation reading the same helper functions.
- No exploratory tool calls were needed to locate the gate brief or CLI contract fields — the after agent's first source edit was the `main.tsx` render-block removal itself, built directly from the transcribed spec.
- Both attempts independently chose the same two-commit structure (implementation, then a separate evidence-only capture commit) and the same `aria-label` accessible-naming approach, without being told to do either.

See `evidence/comparison.md` for the machine-generated protected-baseline-versus-this-implementation comparison (raw Lighthouse/axe evidence, worst-case thresholds, and the failure-path proof).
