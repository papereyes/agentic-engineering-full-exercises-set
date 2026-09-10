export function routeTask(task = {}) {
  const { risk, ambiguity, scope } = task;
  if (!["low", "medium", "high"].includes(risk) || !["low", "medium", "high"].includes(ambiguity) || !["one-file", "three-files", "mechanical", "cross-boundary"].includes(scope)) return "clarify";
  if (ambiguity === "high") return "clarify";
  if (risk === "high" || scope === "cross-boundary") return "reasoning";
  if (risk === "medium" || scope === "three-files") return "balanced";
  if (risk === "low" && ambiguity === "low" && ["one-file", "mechanical"].includes(scope)) return "fast";
  return "clarify";
}
