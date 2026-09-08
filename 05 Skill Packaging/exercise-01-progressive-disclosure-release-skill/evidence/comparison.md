# Comparison

## Same conditions

Both primary runs used the same prompt, same agent (Codex CLI 0.153.4), same model (`gpt-5.6-sol`, medium reasoning), same tools, same permissions, same time limit, repository commit `52090edddf032d026ece16ef90feb627bf8e67ac`, and first-attempt evaluation. PR descriptions and CI evidence were identical. The release-notes skill was the only changed input: the before run received the protected monolithic draft; the after run received `.agents/skills/release-notes/SKILL.md` and its routed resources.

## Before

The broad draft triggered a skill-packaging detour. Its final response summarized and linked an artifact instead of returning the required release notes, so verification scored 1/11 (9%). It asserted Git tracing without including trace values in the saved output, mentioned internal telemetry, and loaded 2934 bytes of monolithic instructions.

## After

The trigger selected the customer release workflow and the extractor used the exact Git range. The response published two customer items, gave real Git traces, labeled the billing rename breaking, explained the migration from `invoiceTotal` to `total`, preserved missing evidence for the screenshot and migration dry run, and excluded internal work. Verification scored 11/11 (100%).

## Proof

The reusable script ran once in each skill-backed scenario. Resource logs show selective loading: full release used publication, evidence, and migration resources (2887 bytes); hotfix used publication and evidence only (2446 bytes); internal-only used publication only (1898 bytes). The full path saved 47 context bytes versus the monolith while improving the verified output by 91 percentage points. Hotfix and internal outputs prove unrelated resources were not read.

## Conclusion

Progressive disclosure improved the deliverable and trigger boundary without adding irrelevant context. Git extraction stayed deterministic and reusable, customer classification stayed policy-driven, and context cost fell for every evaluated route.
