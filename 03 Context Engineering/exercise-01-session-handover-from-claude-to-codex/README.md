# Exercise 01 : Session Handover from claude to codex

## Your Mission

You have worked in Claude for a while and the session contains important decisions, unfinished work, failed attempts, and useful repository context. Your mission is to continue the same work in Codex without losing the correct context or repeating completed work.

Create a compact, verified handover that separates current facts from stale assumptions and gives Codex everything needed to continue safely.

The duration for this challenge is 30 min or less.

## Project

[bugfix-context-app](./bugfix-context-app) contains an unfinished production change and the saved Claude session used for this exercise.

Codex must receive only the handover and the repository. It must not receive the complete Claude chat or additional explanations.

## How To Go About It

1. Review the Claude session and repository state.
2. Identify the current request, completed work, failed attempts, decisions, assumptions, changed files, remaining work, and verification status.
3. Verify important claims against the repository before including them.
4. Create `evidence/handover.md` with only the context Codex needs.
5. Start a fresh Codex session and give it the handover. Let Codex continue the task without hints or corrections.
6. Record what Codex understood, what it completed, and any context that was missing or misleading.

## Evidence

Submit the handover, its source audit, the fresh Codex result, the completed implementation, verification output, and a focused pull request.

## Completion Criteria

The challenge is complete when Codex can continue from the handover alone, does not repeat completed work, does not follow stale information, and completes or correctly reports the remaining work with evidence.
