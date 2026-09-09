# Publishable Change Without Verification Records

- Scenario: `release-notes-app/.agents/skills/release-notes/evals/no-evidence-eval.json`
- Prompt: Create customer release notes for `exercise-base..hotfix-head`. No verification records were supplied. Trace the published change to Git and report verification status without implying that tests passed.
- Agent: Codex CLI 0.153.4
- Model: gpt-5.6-sol (medium reasoning)
- Runtime: isolated `codex exec --ephemeral` session in a materialized fixture
- Thread: `01a085b3-87e6-7840-b20e-818da46cdecf`
- Output: `evidence/no-evidence-output.md`
- Output SHA-256: `ec46b79bbeb629e2be58d4c2cdee0c925e11a6818a19d33975a5e45f2713fc60`
- Resources observed: `SKILL.md`, `references/publication-policy.md`, `references/evidence-policy.md`, and `references/migration-policy.md`
- Result: PASS — the output publishes and traces the checkout change, explicitly says no verification records were supplied, calls test status unknown, and makes no passing-test claim.

Before the instruction change, thread `01a085b1-674f-74e0-ba4f-4932045c03d9` produced acceptable wording but did not read `references/evidence-policy.md`. The retained after run demonstrates both required policy routing and output behavior. Neither run was used to rewrite historical primary-run evidence.
