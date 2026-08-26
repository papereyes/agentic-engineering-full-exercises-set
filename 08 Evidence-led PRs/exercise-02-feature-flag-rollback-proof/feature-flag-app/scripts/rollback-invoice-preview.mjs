import fs from "node:fs";
import path from "node:path";

const FLAG_KEY = "invoice-preview-v2";

function argument(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) throw new Error(`Missing ${name}`);
  return process.argv[index + 1];
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const configPath = path.resolve(argument("--config"));
const actor = argument("--actor");
const reason = argument("--reason");
const timestamp = argument("--timestamp");
const expectedRevision = argument("--expected-revision");

const initial = JSON.parse(fs.readFileSync(configPath, "utf8"));
const inputsValid =
  initial.schemaVersion === 1 &&
  initial.flagKey === FLAG_KEY &&
  actor.trim().length > 0 &&
  reason.trim().length > 0 &&
  !Number.isNaN(Date.parse(timestamp)) &&
  initial.revision === expectedRevision;

if (!inputsValid) {
  fail("Invalid or stale rollback input; configuration left unchanged.");
} else {
  const lockPath = `${configPath}.lock`;
  const temporaryPath = `${configPath}.${process.pid}.${Date.now()}.tmp`;
  let lockDescriptor;
  try {
    try {
      lockDescriptor = fs.openSync(lockPath, "wx");
    } catch {
      fail(`Rollback already in progress: ${lockPath} exists.`);
    }

    if (lockDescriptor !== undefined) {
      // Re-read while holding the lock so a concurrent rollback can't win the same revision.
      const current = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (current.revision !== expectedRevision) {
        fail(`Stale revision: expected ${expectedRevision}, found ${current.revision}.`);
      } else {
        const next = {
          ...current,
          enabled: false,
          allowlist: [],
          revision: `rollback-${timestamp.replace(/[:.]/g, "-")}`,
          lastRollback: { actor, reason, timestamp, previousRevision: current.revision },
        };
        fs.writeFileSync(temporaryPath, `${JSON.stringify(next, null, 2)}\n`);

        if (process.env.NODE_ENV === "test" && process.env.ROLLBACK_TEST_FAIL_BEFORE_RENAME === "1") {
          fail("Injected failure before rename (test mode).");
        } else {
          fs.renameSync(temporaryPath, configPath);
          console.log(`Rollback applied: ${configPath} revision ${next.revision}`);
        }
      }
    }
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
    if (lockDescriptor !== undefined) {
      fs.closeSync(lockDescriptor);
      if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
    }
  }
}
