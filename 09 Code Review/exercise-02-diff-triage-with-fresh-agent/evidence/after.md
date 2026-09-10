# After: focused cache remediation

- Starting commit: e134b7e7b3163db395144bfb163a06d24ad06507
- Implementation commit: 67529fe614240f569c16a0f2ee03e848442b3d43
- Agent and model: Codex gpt-5.6-sol
- Tools and permissions: repository read, isolated fresh-review context, workspace-write test instrumentation
- Time limit: 60 minutes
- Human hints: 0
- Retries: 0
- Patch: evidence/after.patch
- Patch SHA-256: b51c1414a4d8a45c61e6c33dd68e1219fa8f80e00a9ddf3baf12f0cadb4a55c3

The focused source commit changes only App.tsx, workflowApi.ts, and tests/cache-regressions.test.ts. Filtering no longer deletes persisted state; cached JSON is parsed defensively; default ordering uses a copy; saveAction persists an updated copied list; and evidence collection remains read-only.

Command results: npm run test:cache exited 0 with nine passing tests. npm run agent:check exited 0 after integrity, lint, verifier self-test, format, typecheck, and production build. The protected regression replay and submission verifier are captured under evidence/commands and bind all four finding IDs to this implementation commit.
