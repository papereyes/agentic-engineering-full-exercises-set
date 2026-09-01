import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateAction as evaluateShared } from "../enforce.mjs";

export const agentName = "OpenAI Codex";
export const instructionFiles = ["AGENTS.md"];
export const configurationFiles = [".codex/hooks.json"];
export const evaluateAction = evaluateShared;

function actionFromHook(event) {
  const input = event.tool_input ?? {};
  const command = typeof input.command === "string" ? input.command : "";
  const patchPath = command.match(/^\*\*\* (?:Add|Update|Delete) File:\s*(.+)$/m)?.[1];
  let candidatePath = input.path ?? input.file_path ?? patchPath ?? "";
  if (typeof candidatePath === "string" && path.isAbsolute(candidatePath)) {
    candidatePath = path.relative(event.cwd, candidatePath);
  }
  const tool = String(event.tool_name ?? "");
  const operation = tool === "Bash" ? "command" : /read/i.test(tool) ? "read" : /edit|write|apply_patch/i.test(tool) ? "edit" : tool;
  return { operation, path: candidatePath, command, prompt: input.prompt, symlinkTarget: input.symlinkTarget };
}

async function runHook() {
  try {
    let input = "";
    for await (const chunk of process.stdin) input += chunk;
    const event = JSON.parse(input);
    const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
    const policy = JSON.parse(await fs.promises.readFile(path.join(appRoot, "guardrails/policy.json"), "utf8"));
    const result = evaluateShared(policy, actionFromHook(event));
    const allowed = result.decision === "allowed";
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: allowed ? "allow" : "deny",
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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await runHook();
