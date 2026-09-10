# After evaluation

- Starting commit: `5c099d27fa4c530dee5a76190aff64e6975f7441`
- Implementation commit: `6873297d8c7f670c9561ecd1a323e7d9958819a6`
- Agent and model: Codex, GPT-5.6 Sol
- Tools and permissions: identical nonce-bound read-only review adapter and protected evaluation cases
- Time limit: 9 minutes per case
- Human hints: 0
- Retries: 0
- Patch SHA-256: `a023438dee5406d37e360628549222a820cc94ee348ef7dbb7042d66f12e3652`

The skill-assisted sessions used the same adapter, model, permissions, prompts, diffs, and limits while loading the hardened `SKILL.md`. The skill requires exhaustive rule tracing, representative filter truth tables, before-state reproduction, exact changed-line anchors, one finding per distinct root cause, explicit dismissals, and approval of conforming controls. Historical coverage, security coverage, precision, and clean-control accuracy all reached 1.0.
