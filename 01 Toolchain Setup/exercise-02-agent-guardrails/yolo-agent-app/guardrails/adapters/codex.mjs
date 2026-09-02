import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateAction as evaluateShared } from "../enforce.mjs";

export const agentName = "OpenAI Codex";
export const instructionFiles = ["AGENTS.md"];
export const configurationFiles = [".codex/hooks.json"];
export const evaluateAction = evaluateShared;

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function affectedPaths(tool, input) {
  if (tool === "apply_patch") {
    return [...String(input.command ?? "").matchAll(/^\*\*\* (?:(?:Add|Update|Delete) File|Move to):\s*(.+)$/gm)].map(
      (match) => match[1]
    );
  }
  const candidate = input.path ?? input.file_path;
  return candidate === undefined ? [] : [candidate];
}

function resolvePolicyPath(candidate, cwd) {
  if (typeof candidate !== "string" || !candidate || candidate.includes("\0")) return null;
  const absolute = path.resolve(cwd, candidate);
  try {
    const resolved = fs.existsSync(absolute)
      ? fs.realpathSync(absolute)
      : path.join(fs.realpathSync(path.dirname(absolute)), path.basename(absolute));
    const relative = path.relative(appRoot, resolved).replaceAll(path.sep, "/");
    return relative && !relative.startsWith("../") && !path.isAbsolute(relative) ? relative : null;
  } catch {
    return null;
  }
}

function loadApprovals(file) {
  if (!path.isAbsolute(file) || !fs.existsSync(file)) return [];
  const relative = path.relative(appRoot, fs.realpathSync(file));
  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) return [];
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(parsed.actions) ? parsed.actions : [];
}

function hasApproval(approvals, action) {
  return approvals.some(
    (approval) =>
      approval?.operation === action.operation &&
      (approval.path ?? "") === (action.path ?? "") &&
      (approval.command ?? "") === (action.command ?? "")
  );
}

function combine(results) {
  return (
    results.find((result) => result.decision === "blocked") ??
    results.find((result) => result.decision === "approval-required") ??
    results[0] ??
    { decision: "blocked", reason: "No policy path was supplied" }
  );
}

export function evaluateHookEvent(policy, event, approvalFile = process.env.GUARDRAIL_APPROVAL_FILE ?? "") {
  const input = event.tool_input ?? {};
  const tool = String(event.tool_name ?? "");
  const operation = tool === "Bash" ? "command" : /read/i.test(tool) ? "read" : /edit|write|apply_patch/i.test(tool) ? "edit" : tool;
  const command = tool === "Bash" && typeof input.command === "string" ? input.command : "";
  const rawPaths = affectedPaths(tool, input);
  const paths = rawPaths.length ? rawPaths.map((candidate) => resolvePolicyPath(candidate, event.cwd ?? appRoot)) : [""];
  if (paths.includes(null)) return { decision: "blocked", reason: "Path resolution failed closed" };

  let approvals = [];
  try {
    approvals = approvalFile ? loadApprovals(approvalFile) : [];
  } catch {
    return { decision: "blocked", reason: "Approval receipt validation failed closed" };
  }

  return combine(
    paths.map((candidatePath) => {
      const action = { operation, path: candidatePath, command, prompt: input.prompt };
      const result = evaluateShared(policy, action);
      return result.decision === "approval-required" && hasApproval(approvals, action)
        ? { decision: "allowed", reason: "Matching human approval receipt found" }
        : result;
    })
  );
}

async function runHook() {
  try {
    let input = "";
    for await (const chunk of process.stdin) input += chunk;
    const event = JSON.parse(input);
    const policy = JSON.parse(await fs.promises.readFile(path.join(appRoot, "guardrails/policy.json"), "utf8"));
    const result = evaluateHookEvent(policy, event);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: result.decision === "allowed" ? "allow" : "deny",
        permissionDecisionReason: result.reason
      }
    }));
  } catch {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Guardrail evaluation failed closed"
      }
    }));
  }
}

if (process.argv.includes("--hook")) await runHook();
