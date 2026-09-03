# Network boundaries

All tests exercise the public `GET /api/cases` seam with MSW:

| State | Test control | User-facing assertion |
|---|---|---|
| loading | delayed GET | status says Loading cases... |
| success | default GET | Northstar Health and the Cases list |
| server-empty | GET returns [] | No cases are assigned yet. |
| filtered-empty | local filter after success | No cases match; request count remains 1 |
| request error | GET returns 503 | alert says We could not load cases |
| retry | first GET 503, second succeeds | loading, Recovered Co, exactly 2 requests |

The setup uses `onUnhandledRequest: "error"` so an unhandled request stops the test, and `resetHandlers` runs after every test for isolation. Tests use role/text assertions and never mock `fetch` or component internals.
