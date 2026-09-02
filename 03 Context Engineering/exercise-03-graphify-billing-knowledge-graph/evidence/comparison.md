# Normal Search vs Graph-First Comparison

## Fair First-Attempt Conditions

Both sessions started at `52090edddf032d026ece16ef90feb627bf8e67ac`, used Codex with `gpt-5.6-sol` at medium reasoning, identical tools, permissions, 30-minute limits, and the exact incident prompt. Both were retained first attempts with one procedural design approval and no technical hint, correction, or retry. The sole treatment difference was normal repository search versus the Graphify graph.

## Findings

Both agents answered 6 of 6 questions correctly, opened 14 files, used zero wrong files or stale sources, made zero unsupported assumptions, and passed all 8 billing cases plus application verification. Each changed only `recognizedRevenue.ts` with `+3 / -6` lines. The baseline tests `event.kind === "refund"`; the graph-first patch tests the equivalent `event.kind === "charge"`, so the genuine patches differ without changing behavior.

Graph-first context did not improve functional correctness or reduce the counted files opened in this run because normal search already found the safe shared edit path. It did improve the audit trail: exact graph queries exposed confidence levels, distinguished extracted call edges from inferred or ambiguous documentation leads, and recorded source verification before implementation. Verification covers account grouping, charge credits, negative refunds, missing mappings, both consumers, immutability, and unchanged gross volume.
