import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const exerciseRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const provider = path.join(exerciseRoot, "workflow-rules-api");
const client = path.join(exerciseRoot, "workflow-gate-app");

function executeCommand(command, args, options) {
  if (process.platform === "win32") {
    return spawnSync("cmd.exe", ["/d", "/s", "/c", [command, ...args].join(" ")], {
      ...options,
      shell: false,
    });
  }
  return spawnSync(command, args, { ...options, shell: false });
}

export const releaseSteps = [
  {
    id: "gate-contract",
    command: "npm",
    args: ["run", "test:gate"],
    cwd: client,
  },
  {
    id: "client-release",
    command: "npm",
    args: ["run", "test:release"],
    cwd: client,
  },
  {
    id: "client-quality-build",
    command: "npm",
    args: ["run", "agent:check"],
    cwd: client,
  },
  {
    id: "provider-tests-build",
    command: process.platform === "win32" ? "mvnw.cmd" : "./mvnw",
    args: ["-q", "verify"],
    cwd: provider,
  },
];

export function runReleaseGate(steps = releaseSteps, execute = executeCommand, logger = console) {
  for (const step of steps) {
    logger.log(`VERIFY ${step.id}: ${step.command} ${step.args.join(" ")}`);
    const result = execute(step.command, step.args, {
      cwd: step.cwd,
      stdio: "inherit",
      shell: false,
    });

    if (result.error || !Number.isInteger(result.status)) {
      logger.error(`FAILED ${step.id}: ${result.error?.message ?? "process did not return an exit code"}`);
      return 1;
    }
    if (result.status !== 0) {
      logger.error(`FAILED ${step.id} with exit code ${result.status}`);
      return result.status;
    }
    logger.log(`PASS ${step.id}`);
  }

  logger.log("VERIFIED release gate passed.");
  return 0;
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  process.exitCode = runReleaseGate();
}
