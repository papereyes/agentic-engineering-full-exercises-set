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
| `agent-onboarding-app/AGENTS.md:15` | `src/App.tsx:17-27` derives the filtered, sorted, and enriched visible list once; `src/App.tsx:39` uses that list for the count. |
| `agent-onboarding-app/AGENTS.md:9` | The agent ran both `npm run agent:check` and `npm run verify:implementation`; each exited 0. |
