# Exercise 04 : Extract domain model from entire repo

## Your Mission

You are working in a business domain where important knowledge is scattered across code, tests, policies, examples, and documents. Different files use the same business terms differently, so an AI agent or a new team member can make a technically valid change that breaks business rules.

Your mission is to extract the business domain model from the entire repository and create clear domain documentation for both AI agents and people.

The duration for this challenge is 60 min or less.

## Project

[product-rules-app](./product-rules-app) contains business entities, workflows, rules, examples, and conflicting terminology. Focus on business domain knowledge, not technologies or source-code folders.

## How To Go About It

1. Collect business terms, entities, roles, relationships, lifecycle states, rules, invariants, and exceptions from the entire repository.
2. Compare their use across code, tests, policies, examples, and documents.
3. Resolve conflicting meanings using current evidence and record unanswered questions instead of guessing.
4. Create `docs/domain-model.md` with the domain overview, glossary, entities, relationships, workflows, rules, boundaries, and sources.
5. Add a domain diagram and test the result by asking a fresh agent business questions using only this context.

## Evidence

Submit the domain model, domain diagram, terminology and rule audit, fresh-agent query results, source traceability, and a focused pull request.

## Completion Criteria

The challenge is complete when the document represents business meaning across the repository, distinguishes similar terms, records important rules and exceptions, and gives an AI agent enough business context without inventing domain rules.
