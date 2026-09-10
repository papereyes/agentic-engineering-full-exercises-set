# Exercise 02 : Generate the agents.md for a brown field repository

## Your Mission

Your team uses a brownfield repository with limited documentation, mixed coding patterns, and important conventions hidden in the code. Fresh agents make broad or inconsistent changes because they cannot quickly identify the correct architecture, coding rules, Java practices, tests, and development workflow.

Your mission is to create a concise `AGENTS.md` that gives an agent a safe starting point and redirects it to focused supporting documents for deeper guidance.

The duration for this challenge is 45 min or less.

## Project

[brownfield-agent-app](./brownfield-agent-app) is the base repository for this exercise. Inspect it before deciding which existing patterns are correct and which should not be repeated.

## How To Go About It

1. Ask a fresh agent to plan a small change without agent guidance and record its unsafe assumptions or poor pattern choices.
2. Inspect the architecture, build workflow, tests, code quality rules, Java conventions, and common failure points.
3. Create a concise `brownfield-agent-app/AGENTS.md` containing only safe-start rules and links to deeper guidance.
4. Create the supporting documents the repository needs, such as `.agent/architecture.md`, `.agent/coding-quality-practices.md`, `.agent/java-practices.md`, `.agent/testing.md`, and `.agent/development-workflow.md`.
5. Start another fresh agent session with the guidance and give it the same task under the same conditions.
6. Compare the results and identify which instructions improved the second result.

Choose the final supporting files from what the repository actually needs. Do not copy generic guidance or place every detail in `AGENTS.md`.

## Evidence

Submit `AGENTS.md`, the supporting documents, before and after session evidence, a comparison, verification output, and a focused pull request.

## Completion Criteria

The challenge is complete when a fresh agent can use `AGENTS.md` to find the right guidance, make a focused change that follows the repository's intended practices, and verify the result without human correction.
