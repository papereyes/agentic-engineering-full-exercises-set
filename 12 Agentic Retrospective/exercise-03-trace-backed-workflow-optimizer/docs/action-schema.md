# Workflow Response Schema

Each replay response is JSON with ordered `actions`, optional `findings`, optional `contextSelections`, optional `blocker`, and optional `completion`.

An action contains only the fields needed to describe the event:

- `sequence`: increasing positive integer;
- `type`: `scope`, `clarify`, `source-decision`, `edit`, or `verify`;
- `target`: a short kebab-case name for the affected boundary, source, project, or verification gate;
- `result`: a non-empty description such as `confirmed`, `authoritative`, `passed`, or `failed`;
- `exitCode`: an integer required for every `verify` action.

The available target vocabulary is `queue-filter`, `billing-export`, `current-policy`, `legacy-note`, `release-gate`, `deletion-mode`, `decision-contract`, `client`, `api`, and `protected-policy`.

A finding contains a string `type` and a string array named `sources`. `contextSelections` is a string array. Completion contains a Boolean `claimed` and an integer array named `evidenceSequences`. A blocker contains a Boolean `reported` and a string `target`. Do not add other top-level response fields.

The schema explains how to record decisions. It does not identify which actions satisfy a replay case.
