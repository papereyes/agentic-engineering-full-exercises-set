# Before Run

- Agent: Codex CLI 0.153.4
- Model: gpt-5.6-sol (medium reasoning)
- Other tools: shell, Git, filesystem
- Permissions: danger-full-access in a disposable fixture
- Time limit: 10 minutes
- Prompt: Create customer release notes for `exercise-base..origin/exercise-head`. Trace every published item to Git, identify breaking and migration impact, report missing verification evidence, and exclude internal-only work.
- Repository commit: 52090edddf032d026ece16ef90feb627bf8e67ac
- Attempt: 1
- Release-notes skill: disabled
- Input context: `docs/monolithic-skill-draft.md`, `docs/pr-descriptions.md`, and `docs/ci-evidence.md`
- Context bytes: 2934
- Output: `evidence/before-output.md`

## Observations

- Files read: the three supplied task files, fixture Git history and diffs, and the automatically available system `skill-creator/SKILL.md`. The candidate `.agents/skills/release-notes/SKILL.md` was absent.
- Commands executed: inspected the exact Git range; initialized an unrelated global skill package; wrote `RELEASE_NOTES.md` in the disposable fixture; ran direct checkout and billing behavior checks plus structural YAML checks.
- Verification: `npm run release:verify -- /tmp/exercise-05-01-before-fixture-final /tmp/exercise-05-01-before-output-final.md` scored 1 of 11 checks (9) because the final response linked to its artifact instead of containing the required release-note structure.
- Exit code: the agent session exited 0; release verification exited 1.

`npm run context:measure -- ../docs/monolithic-skill-draft.md` measured the monolithic instruction context at exactly 2934 UTF-8 bytes. PR descriptions and CI evidence were task data supplied equally to both primary runs, not skill-instruction context.
