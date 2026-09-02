# Superpowers Skill Usage

- Superpowers version or commit: installed Codex skill snapshot; standalone commit metadata unavailable
- superpowers:brainstorming: classified the feature, explored repository evidence, compared approaches, presented the design, and enforced approval before implementation.
- Design approval: the user explicitly approved the complete lifecycle design before the design artifact and implementation plan were finalized.
- Design artifact: `docs/superpowers/specs/2026-09-02-team-invitations-design.md`
- superpowers:writing-plans: produced the executable task sequence with exact files, interfaces, tests, and verification commands.
- Plan artifact: `docs/superpowers/plans/2026-09-02-team-invitations.md`
- superpowers:executing-plans: selected by the user for inline task-by-task execution on the dedicated exercise branch.
- superpowers:test-driven-development: used the supplied lifecycle contract; the starter failure was captured before changing production code, followed by the minimum passing implementation.
- superpowers:systematic-debugging: isolated Node ESM resolution and protected-config failures before applying the narrow runtime-import correction.
- superpowers:requesting-code-review: applied after implementation; inline selection required local diff review rather than subagent dispatch.
- superpowers:verification-before-completion: applied after review for fresh lifecycle, integrity, lint, format, typecheck, build, and exercise verification evidence.

GitNexus impact checks reported LOW risk for `createInvitation`, `acceptInvitation`, `revokeInvitation`, and `App`. The index refresh could not write outside the app sandbox, so this limitation was retained when interpreting change detection.
