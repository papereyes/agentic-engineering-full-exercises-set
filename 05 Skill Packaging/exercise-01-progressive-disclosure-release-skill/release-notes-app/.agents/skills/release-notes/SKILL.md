---
name: release-notes
description: Use when creating customer release notes or deciding whether a Git range contains publishable changes. Exclude requests for internal engineering changelogs, commit summaries, or implementation reviews that are not customer-facing.
compatibility: Requires Git and Node.js 22 or newer.
---

# Release Notes

Derive release facts from Git, then write only customer-visible changes.

1. Read [references/publication-policy.md](references/publication-policy.md).
2. Run `node scripts/extract-release.mjs --repo <path> --base <ref> --head <ref>` once for the requested range. Treat its JSON as the Git trace.
3. Classify the commits. Put publishable items under `## Customer-facing changes`, one `###` item per change, and do not mention excluded internal work anywhere in that deliverable. If nothing is publishable, report that decision with the range and Git evidence; do not add that heading.
4. When a publishable change has supplied verification records, read [references/evidence-policy.md](references/evidence-policy.md).
5. When a publishable change alters or removes an existing contract, read [references/migration-policy.md](references/migration-policy.md).

Do not preload conditional references. Select them only after extraction and only for commits inside the requested range; ignore supporting material about changes outside that range.
