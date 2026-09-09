# Agent Board

The canonical [structured board](./agent-board.json) and application mirror agree after ESC-120 integration. There are no active reservations.

| Card | Final state | Assignment decision | Reservation result |
|---|---|---|---|
| ESC-118 | needs-info | Unassigned until `REPRO-118` exists | Released `workflowApi.ts` |
| ESC-120 | merged | Implemented by severity-agent and accepted by risk-owner | Released all lane paths after merge |
| ESC-122 | blocked | Unassigned while `RULE-ESC-122` is unanswered | Released the conflicting scoring path |
| ESC-121 | cancelled | Never assigned because the fixture is unsafe | Released `exportApi.ts` |

ESC-120 retains its full incoming → triaged → ready-for-agent → in-progress → in-review → merged history. The other cards remain visible without inventing missing requirements or deleting terminal history.
