# Domain Audit

## Current Rules Retained

| Rule | Authoritative source and line | Domain term or ADR decision |
|---|---|---|
| Billing and product access are separate boundaries | `docs/current-access-policy.md:11-14` | Billing Customer, Workspace, Membership |
| Export requires Enterprise and standard residency | `docs/current-access-policy.md:18-21` | Export Eligibility |
| Membership must match the requesting user and same workspace | `docs/current-access-policy.md:22-23` | User, Membership, Workspace |
| Membership must be active and admin | `docs/current-access-policy.md:24-25` | Membership Status, Membership Role |
| Billing ownership alone grants no access | `docs/current-access-policy.md:27` | ADR 0001 boundary decision |

## Legacy or Unsupported Assumptions Excluded

| Assumption | Source | Current evidence that rejects it |
|---|---|---|
| Growth workspaces are eligible | `docs/legacy-rollout-notes.md:8` | The document is a superseded draft (`:3`) and the current policy permits only Enterprise (`docs/current-access-policy.md:20`). |
| A billing owner may export | `docs/legacy-rollout-notes.md:6-8` | Billing ownership is billing-only and grants no workspace access (`docs/current-access-policy.md:11,27`). |
| An admin label is sufficient without scope or status | `docs/previous-agent-progress.md:9` | Current policy requires matching user, same workspace, active status, and admin role (`docs/current-access-policy.md:22-25`). |
| A resolved support case defines policy | `docs/support-example.md:5-11` | The case demonstrates but does not replace current policy (`:11`). |

## Context Boundary

The final implementation agent received the exact product prompt and `CONTEXT.md`. It could inspect the current repository files linked from that glossary, including ADR 0001 and its cited sources. The previous implementation and `before.patch` were not provided or shared, and no extra domain explanation, correction, retry, or implementation hint was given.

The immutable session identifiers, hashes, exact invocation boundary, and source-before-implementation chronology are recorded in `evidence/preparation-session.md`.
