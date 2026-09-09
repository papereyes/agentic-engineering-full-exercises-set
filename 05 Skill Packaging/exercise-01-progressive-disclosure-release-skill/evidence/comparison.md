# Comparison

## Same conditions

Both primary runs used the same prompt, same agent (Codex CLI 0.153.4), same model (`gpt-5.6-sol`, medium reasoning), same tools, same permissions, same time limit, repository commit `52090edddf032d026ece16ef90feb627bf8e67ac`, and first-attempt evaluation. PR descriptions and CI evidence were identical. The release-notes skill was the only changed input: the before run received the protected monolithic draft; the after run received `.agents/skills/release-notes/SKILL.md` and its routed resources.

## Before

The broad draft triggered a skill-packaging detour. Its actual `RELEASE_NOTES.md` contained both customer changes, the breaking migration, both evidence gaps, and exact Git SHAs while excluding telemetry, so the qualitative eval is 5/5. The strict release verifier still scored it 1/11 (9%) because it lacked the required customer section, `###` item structure, and item-local `- Trace:` lines. The separate chat response is retained but is not the scored deliverable. The run loaded 2934 bytes of monolithic instructions.

## After

The trigger selected the customer release workflow and the extractor used the exact Git range. The response preserved the same factual coverage, including missing evidence, while placing it in the required auditable structure. Verification scored 11/11 (100%). A post-review policy correction now loads evidence guidance for every publishable change, including when no verification records are supplied; the separate no-evidence scenario proves that route.

## Proof

The reusable script ran once in each primary skill-backed scenario. Current resource measurements show selective loading: full release uses publication, evidence, and migration resources (2916 bytes); hotfix uses publication and evidence only (2475 bytes); internal-only uses publication only (1927 bytes). The full path remains 18 bytes smaller than the monolith. The strict score improves by 91 percentage points through structure and trace placement; factual completeness is not claimed as an improvement. Hotfix and internal outputs prove unrelated resources remain unloaded.

## Conclusion

Progressive disclosure improved format compliance, trace locality, and policy routing without losing the baseline's factual coverage. Git extraction stayed deterministic and reusable, customer classification stayed policy-driven, and context cost remained below the monolith for the full route.
