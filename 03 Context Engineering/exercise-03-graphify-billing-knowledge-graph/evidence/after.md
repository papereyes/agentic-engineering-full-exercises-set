# After: Graph-First Context

## Run

- Starting commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Implementation commit: 35e1f7f9acc8db48f200108f40f707571977cd44
- Agent: Codex
- Model: gpt-5.6-sol (medium reasoning)
- Tools: Repository file inspection, file editing, and shell commands
- Permissions: Workspace-write sandbox; restricted network; approvals unavailable to the implementation agent
- Time limit: 30 minutes
- Attempt: 1
- Human hints: 0
- Prompt: Correct recognized-revenue totals in the dashboard and scheduled snapshot. Use the current metric rules and billing-account boundaries, preserve gross-volume behaviour, and reject events without a valid account mapping.
- Context source: Graphify graph
- Graphify: Enabled
- Patch: `evidence/after.patch`
- Patch SHA-256: 2c7097b289d2ce8c3154589012a1ea3980e63d689a047431bab7fc44395b3bf6

## Results

| Proof | Result |
|---|---|
| `npm run test:billing` | Pass; exit code: 0; 8 of 8 checks passed |
| `npm run test:graph` | Pass; exit code: 0; 168 nodes and 220 links |
| `npm run agent:check` | Pass; exit code: 0 |
| Graph questions answered correctly | 6 out of 6 |
| Files opened | 14 |
| Wrong or stale sources used | 0 |
| Unsupported assumptions | 0 |
| Files changed | 1 |
| Lines added and removed | `+3 / -6` |

The agent queried the graph before opening application source, then source-verified the graph's inferred and ambiguous documentation leads. The only human response approved the agent's independently proposed design and supplied no technical hint, correction, or retry.
