# Before: Naive First Attempt

- Starting commit: `52090edddf032d026ece16ef90feb627bf8e67ac`
- Implementation commit: `a337070408b658cab7c5565d3cc4807384b1d810`
- Agent and model: Claude Code general-purpose subagent, `claude-sonnet-5`
- Tools and permissions: full tool access (Bash, Read, Write, Edit, Grep, Glob), same permission mode as the orchestrating session
- Time limit: None imposed
- Human hints: 0
- Retries: 0
- Prompt: the bare mission paragraph from the exercise README only — no mention of `docs/quality-gate-brief.md`, `docs/gate-cli-contract.md`, `docs/sample-reports.md`, or any field/behavior spec
- Patch: `evidence/before.patch`
- Patch SHA-256: `1ade55e608dceae86272568a83f2ef929b27c849f133f6452d7a8f1a65f48eee`

| Proof | Run 1 | Run 2 | Run 3 | Gate value |
|---|---:|---:|---:|---:|
| Performance | 1.00 | 1.00 | 1.00 | 1.00 (worst) |
| Accessibility | 1.00 | 1.00 | 1.00 | 1.00 (worst) |
| LCP in ms | 1354.09 | 1352.33 | 1351.64 | 1354.09 (worst) |

- Axe violations: 0 (protected baseline was 1: `button-name`)
- Accessible-name result: `aria-label="Download report"` added to the icon-only header button
- Production build SHA-256: `01efa6c1844c2050d21bc4fe2dc9a8d1d3007b169fd36ea7be293f1ca9c0048d`
- Browser environment: Playwright `chromium` channel, version `151.0.7922.34` (same major for Lighthouse and axe)
- Gate exit code (valid evidence): `0`
- Deliberate Lighthouse failure exit code: `1` (`releaseDecision: "failed"`, `performance below minimum`)
- Deliberate axe failure exit code: `1` (`releaseDecision: "failed"`, `axe violations above maximum`)
- Files changed: 4 (`src/App.tsx`, `src/main.tsx`, `lighthouserc.json`, `scripts/quality-gate.mjs`)
- Lines added / removed: +101 / -7

## What happened

Given only the raw mission (no docs pointed to, no field spec, no gate CLI contract), the agent independently opened `docs/quality-gate-brief.md` and `docs/gate-cli-contract.md` before writing any code, removed the seeded synchronous 3200ms busy-wait in `src/main.tsx`, added an `aria-label` to the icon-only action in `src/App.tsx`, and built `lighthouserc.json` and `scripts/quality-gate.mjs` against those contracts without being told they existed. It also captured real browser evidence itself (`npm run quality:capture`) and committed it in a separate evidence-only follow-up commit.

Re-verified independently at its own implementation commit (`a337070408b658cab7c5565d3cc4807384b1d810`), in place on branch `exercise-08-03-before`:

- `npm run agent:check` → exit 0 (44 protected inputs verified, lint, test, format, typecheck, build all pass)
- `npm run quality:verify` → exit 0, all six protected checks PASS: raw report/route/environment binding, pessimistic thresholds met, digest and comparison integrity, capture-manifest binding, performance and axe negative controls both returning non-zero with a failed decision, and Git source-SHA binding with an evidence-only follow-up commit

The exercise's premise — that an unguided first attempt is likely to leave a gap the spec would have caught — did not materialize in this trial: this agent independently found and followed both contract documents without being told they existed, and its release decision matches the after attempt's.
