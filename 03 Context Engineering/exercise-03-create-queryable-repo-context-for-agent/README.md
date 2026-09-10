# Exercise 03 : Create queryable repo context for agent

## Your Mission

Your repository is too large for an AI agent or a new team member to understand through repeated file searches. Your mission is to create a queryable repository graph using Graphify.

The graph must help an AI agent and a human user find components, dependencies, business rules, data flow, ownership, and the source of important decisions without loading the entire repository into every session.

The duration for this challenge is 45 min or less.

## Project

[billing-graph-app](./billing-graph-app) contains application code, tests, and documents with relationships that are not explained in one place. Build the graph from the complete exercise repository.

## How To Go About It

1. Install and configure [Graphify](https://github.com/Graphify-Labs/graphify) for your coding agent.
2. Index the complete repository, including code, tests, configuration, and documents.
3. Create useful queries for architecture, dependencies, data flow, business rules, ownership, and change impact.
4. Use `graphify query`, `graphify path`, and `graphify explain` to answer them.
5. Verify important answers against source files and record unsupported or ambiguous results.
6. Show how a fresh agent and a user can query the graph to understand the repository or plan a change.

## Evidence

Submit the Graphify outputs, query results, source audit, agent and user usage examples, and a focused pull request.

## Completion Criteria

The challenge is complete when the graph represents the repository accurately, important answers are traceable to source files, and both agents and users can query it to reduce repeated repository discovery.
