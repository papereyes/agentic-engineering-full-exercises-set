Created the customer release notes and a reusable standards-compliant skill package.

- [Release notes](/tmp/exercise-05-01-before-fixture-final/RELEASE_NOTES.md)
- [Release skill](/tmp/exercise-05-codex-home/skills/customer-release-notes/SKILL.md)
- [Publication and evidence policy](/tmp/exercise-05-codex-home/skills/customer-release-notes/references/publication-and-evidence.md)

The notes:

- Identify `invoiceTotal` → `total` as breaking and provide migration timing.
- Publish the checkout retry improvement.
- Trace both items to full Git commit hashes.
- Exclude the internal telemetry cleanup.
- Report the missing browser screenshot and migration dry run.
- Correctly state that the release is not fully verified for publication.

Direct behavior checks and structural YAML checks passed. The bundled skill validator could not run because its `PyYAML` dependency is not installed.
