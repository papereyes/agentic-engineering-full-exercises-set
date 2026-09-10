# Exercise 03 : payment module visualization

## Your Mission

Your team cannot clearly explain the payment module because its behaviour is spread across checkout, payment, webhook, ledger, and receipt code. Your mission is to inspect the implementation and visualize the complete payment module.

Create four diagrams: an Architecture diagram, a sequence diagram, a flow chart, and an ER diagram.

The duration for this challenge is 75 min or less.

## Project

[payment-workflow-app](./payment-workflow-app) contains the payment module, data models, integrations, tests, and supporting documents. Verify every important relationship against code or observed behaviour.

## How To Go About It

1. Identify the components, external systems, data stores, actors, entities, states, and business decisions.
2. Trace checkout, authorization, webhook handling, duplicate events, failures, ledger updates, and receipt creation.
3. Create an Architecture diagram showing system boundaries and dependencies.
4. Create a sequence diagram showing the main interaction and important alternatives.
5. Create a flow chart showing decisions, states, failures, and recovery paths.
6. Create an ER diagram showing entities, identifiers, ownership, and relationships.
7. Map important diagram elements to their source files.

## Evidence

Submit all four diagrams, source traceability, validation output, recorded contradictions, and a focused pull request.

## Completion Criteria

The challenge is complete when all four diagrams parse, agree with one another, represent the implemented payment module, include important failure and duplicate-event behaviour, and are supported by source evidence.
