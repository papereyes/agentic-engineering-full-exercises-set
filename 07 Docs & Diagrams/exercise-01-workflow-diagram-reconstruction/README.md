# Exercise 01 : Reverse engineer sequence diagram

## Your Mission

Your team needs to understand an important workflow, but the existing documentation is incomplete and outdated. Your mission is to reverse engineer the workflow from the code and create a new sequence diagram that accurately shows how it works.

The duration for this challenge is 45 min or less.

## Project

[workflow-reconstruction-app](./workflow-reconstruction-app) contains the workflow implementation, tests, and an outdated description. The code and verified runtime behaviour are the authority.

## How To Go About It

1. Identify the workflow entry point, actors, services, decisions, calls, responses, failures, and rollback paths.
2. Trace normal, high-risk, and failure scenarios through the code and tests.
3. Create one Mermaid sequence diagram containing the important alternatives and error paths.
4. Map every important interaction to the source file and line that proves it.
5. Record differences between the old documentation and the implementation.

## Evidence

Submit the new sequence diagram, source traceability, recorded contradictions, parser output, and a focused pull request.

## Completion Criteria

The challenge is complete when the sequence diagram parses, represents the implemented workflow without invented steps, includes important failure paths, and every important interaction is supported by source evidence.
