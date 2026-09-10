# Before evaluation

- Starting commit: `5c099d27fa4c530dee5a76190aff64e6975f7441`
- Implementation commit: `99f47788c0f7015720a8e6a8f1342c44cbb6ae05`
- Agent and model: Codex, GPT-5.6 Sol
- Tools and permissions: identical nonce-bound read-only review adapter and protected evaluation cases
- Time limit: 9 minutes per case
- Human hints: 0
- Retries: 0
- Patch SHA-256: `b2567957d92a3bf994933909c8f6854cc76ce501366f81d1e17e528695cfaf9d`

Three independent baseline sessions reviewed the historical regression, security regression, and clean control without loading the reusable skill. The baseline covered all seven defect acceptance rules and approved the clean control, but produced two unsupported duplicate blockers. That reduced precision to 0.7777777778. The implementation commit records the immutable session index used for this comparison.
