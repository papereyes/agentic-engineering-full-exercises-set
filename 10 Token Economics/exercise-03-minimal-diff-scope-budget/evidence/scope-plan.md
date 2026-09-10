# Pre-change scope plan

This plan is committed before implementation. The requested change is limited to mapping the export action to `ds-secondary`; checkout, delete, and unknown actions must retain their existing legacy variants.

The budget is exactly two source paths and no more than 30 added-plus-deleted lines:

1. `minimal-diff-app/src/migration/exportButton.mjs` may receive the smallest export-specific branch.
2. `minimal-diff-app/tests/export-button.test.mjs` may add focused coverage for export and the protected legacy cases.

The excluded paths are `src/migration/actionButtons.mjs`, all `src/components`, `src/styles.css`, `package.json`, and `package-lock.json`. They are visible for understanding but are not implementation scope. Shared component cleanup, design-system generalization, dependency changes, style changes, and migration of unrelated actions are unnecessary.

Run `npm run test:migration` as the focused baseline and regression check. No scope expansion is planned because the existing helper already centralizes variant selection. Evidence files will be added only after the source commit so history proves that planning preceded code and that the implementation commit contains only the two allowed paths.
