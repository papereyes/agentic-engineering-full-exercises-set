# Exercise 02 : Generate design document from code

## Your Mission

Your team has a working application but no reliable design document. Your mission is to inspect the code and generate a design document that explains the system as it exists today.

The document must explain the architecture, responsibilities, dependencies, data flow, important decisions, operational behaviour, and safe change boundaries.

The duration for this challenge is 60 min or less.

## Project

[notification-mesh-app](./notification-mesh-app) contains the application code, tests, configuration, and a stale description. Treat source and verified behaviour as the authority.

## How To Go About It

1. Inspect the repository structure, entry points, modules, interfaces, data models, integrations, configuration, and tests.
2. Trace one main workflow and one failure or fallback workflow.
3. Create `docs/design-document.md` with the system purpose, architecture, component responsibilities, dependencies, data flow, decisions, constraints, risks, and verification guidance.
4. Add only the diagrams needed to make the design easier to understand.
5. Link important statements to source files and record stale or unsupported claims separately.

## Evidence

Submit the design document, diagrams, source map, stale-claim findings, validation output, and a focused pull request.

## Completion Criteria

The challenge is complete when the design document matches the current code, clearly explains how the system works and where changes belong, and its important claims can be verified from the repository.
