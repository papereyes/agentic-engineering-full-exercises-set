# After onboarding

### Run

- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Implementation commit: 61920fb32e5869d66bd85cdd419104c907906ba4
- Agent and model: OpenAI Codex, gpt-5.6-sol, medium reasoning
- Tools and permissions: Codex workspace tools; workspace-write filesystem; restricted network; approval escalation available
- Time limit: 30 minutes
- Human hints: 0
- Retries: 0
- Onboarding files read: `agent-onboarding-app/AGENTS.md`
- Patch: `evidence/after.patch`
- Patch SHA-256: 74a1bfb842b9f83b93125fa32cd98fccd0e9d4eb1ebd313bd5ef8e3ca12696dc

### Results

| Proof | Result |
|---|---|
| `npm run agent:check` | Pass; exit code: 0 |
| `npm run verify:implementation` | Pass; exit code: 0 |
| `npm run verify:exercise` | Pass; exit code: 0 |
| Files changed | 3 |
| Lines added and removed | +43 / -16 |
| Unmet requirements | None |

### Onboarding Used

| Onboarding instruction | Resulting code or verification change |
|---|---|
| `agent-onboarding-app/AGENTS.md:13-14` | `src/services/caseRouter.ts:39-47` keeps the predicate and policy-aware ordering in the routing service without duplicating policy values. |
| `agent-onboarding-app/AGENTS.md:15` | `src/App.tsx:17-27` names and reuses the page's derived view model; `src/App.tsx:39` consumes the same state. |
| `agent-onboarding-app/AGENTS.md:9` | The agent ran both `npm run agent:check` and `npm run verify:implementation`; each exited 0. |

### Final verification transcript

```text
$ npm run verify:exercise

> agent-onboarding-app@0.1.0 verify:exercise
> node ../../../scripts/run-clean-verification.mjs
> agent-onboarding-app@0.1.0 verify:exercise:core
> npm run agent:check && npm run verify:implementation && npm run verify:submission
> agent-onboarding-app@0.1.0 agent:check
> npm run test:integrity && npm run lint && npm run test && npm run format && npm run typecheck && npm run build
> agent-onboarding-app@0.1.0 test:integrity
> node ../../../scripts/verify-protected-inputs.mjs ./challenge-integrity.json
Verified 19 protected challenge inputs.
> agent-onboarding-app@0.1.0 lint
> node ./scripts/lint-check.mjs
lint-check passed
> agent-onboarding-app@0.1.0 test
> node ./scripts/agent-check.mjs
agent-check passed for Agent Onboarding Kit
> agent-onboarding-app@0.1.0 format
> node ./scripts/format-check.mjs
format-check passed
> agent-onboarding-app@0.1.0 typecheck
> node ./node_modules/typescript/bin/tsc --noEmit --pretty false --incremental false
> agent-onboarding-app@0.1.0 build
> node ../../../scripts/run-vite-build.mjs
vite v7.3.6 building client environment for production...
transforming...
✓ 31 modules transformed.
rendering chunks...
computing gzip size...
<temporary-directory>/dist/index.html                  0.41 kB │ gzip:  0.28 kB
<temporary-directory>/dist/assets/index-BA_JkmbT.css   1.44 kB │ gzip:  0.68 kB
<temporary-directory>/dist/assets/index-XQ8XxltH.js  196.78 kB │ gzip: 62.02 kB
✓ built in 980ms
> agent-onboarding-app@0.1.0 verify:implementation
> node ./scripts/verify-implementation.mjs
Needs Attention implementation verified.
> agent-onboarding-app@0.1.0 verify:submission
> node ./scripts/verify-follow-up.mjs
Agent onboarding and evidence verified.
PASS verify:exercise left tracked files, the Git index, and untracked or ignored paths unchanged

stderr: empty
exit code: 0
```
