# Workspace AI-History Export

This context names the product and access-control concepts used for AI-history export. Terminology follows [the approved access policy](docs/current-access-policy.md); the boundary decision is recorded in [ADR 0001](docs/adr/0001-ai-history-export.md).

## Language

**Billing Customer**:
The commercial entity that pays for one or more Workspaces. It is not a product-access boundary.
_Avoid_: Account

**Billing Ownership**:
The billing relationship between a User and a Billing Customer. Billing ownership never grants export access.
_Avoid_: Workspace ownership

**User**:
A person who may request access to a Workspace through a Membership.
_Avoid_: Account

**Workspace**:
The product and data-security boundary whose plan, Data Residency, Memberships, and AI History are evaluated independently.
_Avoid_: Account

**Membership**:
The relationship connecting exactly one User to exactly one Workspace. Authorization uses the Membership for the requesting User in the same Workspace being exported.
_Avoid_: Account access

**Membership Role**:
A permission label attached to a Membership and scoped only to that Membership's Workspace. The canonical administrative role is `admin`.
_Avoid_: Global role

**Membership Status**:
The lifecycle state of a Membership. Only `active` participates in authorization; `suspended` represents no access.

**Data Residency**:
The Workspace's data-handling mode. `standard` can participate in export eligibility; `restricted` cannot.

**Workspace Plan**:
The product tier assigned to a Workspace. Only `Enterprise` can participate in export eligibility.

**AI History**:
The Workspace-scoped history produced by AI features. It belongs to one Workspace's security and residency boundary.

**AI-History Export**:
The operation that releases a Workspace's AI History to the requesting User.

**Export Eligibility**:
The state in which the Workspace is Enterprise with standard Data Residency and the requesting User has an active admin Membership in that same Workspace. Every relationship and condition is required.
