import path from "node:path";

function matchesRegex(patterns, value) {
  return patterns.some((pattern) => new RegExp(pattern, "i").test(value));
}

function matchesGlob(pattern, value) {
  const source = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replaceAll("**", "\0")
    .replaceAll("*", "[^/]*")
    .replaceAll("\0", ".*");
  return new RegExp(`^${source}$`, "i").test(value);
}

function normalizePath(value) {
  if (typeof value !== "string" || value.includes("\0")) return null;
  const normalized = value.replaceAll("\\", "/").replace(/^\.\//, "");
  if (path.posix.isAbsolute(normalized) || path.win32.isAbsolute(value) || normalized.split("/").includes("..")) {
    return null;
  }
  return normalized;
}

export function evaluateAction(policy, action) {
  if (!policy || !action || typeof action !== "object") return { decision: "blocked", reason: "Invalid action" };
  const values = [action.operation, action.path, action.command, action.prompt, action.symlinkTarget];
  if (values.some((value) => value !== undefined && typeof value !== "string")) {
    return { decision: "blocked", reason: "Action fields must be strings" };
  }

  const prompt = action.prompt ?? "";
  const command = action.command ?? "";
  if (matchesRegex(policy.blockedPromptPatterns ?? [], prompt)) {
    return { decision: "blocked", reason: "Prompt matches a blocked injection pattern" };
  }
  if (matchesRegex(policy.blockedCommands ?? [], command)) {
    return { decision: "blocked", reason: "Command matches a blocked rule" };
  }
  if (matchesRegex(policy.approvalCommands ?? [], command)) {
    return { decision: "approval-required", reason: "Command requires human approval" };
  }

  const paths = [action.path, action.symlinkTarget].filter((value) => value !== undefined && value !== "");
  const normalizedPaths = paths.map(normalizePath);
  if (normalizedPaths.includes(null)) return { decision: "blocked", reason: "Path escapes the repository" };
  if (normalizedPaths.some((value) => policy.blockedPaths.some((pattern) => matchesGlob(pattern, value)))) {
    return { decision: "blocked", reason: "Path is protected" };
  }
  if (normalizedPaths.some((value) => policy.approvalPaths.some((pattern) => matchesGlob(pattern, value)))) {
    return { decision: "approval-required", reason: "Path requires human approval" };
  }

  if (!policy.allowedOperations.includes(action.operation)) {
    return { decision: policy.defaultDecision, reason: "Operation is not allowed" };
  }
  if (command) {
    return matchesRegex(policy.allowedCommands ?? [], command)
      ? { decision: "allowed", reason: "Command matches an allow rule" }
      : { decision: policy.defaultDecision, reason: "Command has no allow rule" };
  }
  if (normalizedPaths.length && normalizedPaths.every((value) => policy.allowedPaths.some((pattern) => matchesGlob(pattern, value)))) {
    return { decision: "allowed", reason: "Operation and path are allowed" };
  }
  return { decision: policy.defaultDecision, reason: "No allow rule matched" };
}

export function createAuditRecord(action, result) {
  return {
    operation: typeof action?.operation === "string" ? action.operation : "unknown",
    path: typeof action?.path === "string" ? action.path : "",
    decision: result?.decision ?? "blocked",
    reason: result?.reason ?? "No decision reason"
  };
}
