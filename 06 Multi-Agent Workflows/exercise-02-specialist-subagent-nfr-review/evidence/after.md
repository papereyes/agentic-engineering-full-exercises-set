# Remediation review evidence

## Same conditions

- Repository baseline: `e83928ed3c4d34fd51039c65b3d86373687cb259`
- Remediation SHA: `354692d34864d66324f1af8b9469a3c792f68a9e`
- App directory, four focused commands, Node.js 25.9.0, and dependency installation matched the baseline reruns
- Human hints: 0
- Command-capture retries: 1 after the initial sandboxed `spawnSync git EPERM` attempt
- Independent review condition: each after report came from a fresh session distinct from its before specialist

## Before

At `e83928ed3c4d34fd51039c65b3d86373687cb259`, all four focused commands exited 1. The specialist reports recorded five blockers and one performance warning.

## After

At `354692d34864d66324f1af8b9469a3c792f68a9e`, fresh independent after sessions confirmed the remediation. New integration-owner detached-worktree reruns then captured complete raw command output at that exact SHA; all four commands exited 0.

The protected performance artifacts remain byte-for-byte unchanged: baseline 292.826 ms and remediation 0.067 ms for the same 200-item, five-iteration scenario and result.

## Proof

`after.patch` is the exact source-scoped remediation delta.

- Exact command: `rtk proxy git diff --binary --full-index e83928ed3c4d34fd51039c65b3d86373687cb259 354692d34864d66324f1af8b9469a3c792f68a9e -- '06 Multi-Agent Workflows/exercise-02-specialist-subagent-nfr-review/nfr-swarm-app/src'`
- Exit code: 0
- Patch SHA-256: `08373a26b5b5b8ffd96469254a0a0f4775ba02cbeec89cdd9ffe82db693bb95c`
- Complete focused outputs: `evidence/commands/*-after.txt`
- Pre-hardening branch HEAD: `060b6652af3c36bd862e374a608193a30bc36891`
- Pre-hardening verifier command: `npm run verify:exercise`
- Pre-hardening verifier result: initial sandbox attempt exit 1 (`spawnSync git EPERM`), authoritative outside-sandbox retry exit 0
- Complete verifier output: `evidence/commands/verify-exercise-pre-hardening.txt`
- Verifier transcript SHA-256: `424e79f91d379ad0d881d559cadd6da70aa3712a8a3421ef20a86e610b79f4d6`

## Conclusion

All five blockers and the performance warning are resolved at the recorded remediation SHA. Remaining risk is broader manual assistive-technology, production-load, and real-identity validation.
