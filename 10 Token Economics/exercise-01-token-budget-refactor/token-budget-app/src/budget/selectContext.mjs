export function selectContext(catalog, task = {}, maximumBytes) {
  if (!Number.isInteger(maximumBytes) || maximumBytes <= 0) throw new Error("Context budget must be a positive integer");
  if (new Set(catalog.map((item) => item.id)).size !== catalog.length) throw new Error("Duplicate context id");

  const taskTags = [...new Set(task.tags ?? [])].sort();
  const questionTags = [...new Set(task.questions ?? [])].sort();
  const requestedTags = [...new Set([...taskTags, ...questionTags])].sort();
  const ordered = [...catalog].sort((left, right) => Number(right.mandatory) - Number(left.mandatory) || right.priority - left.priority || left.id.localeCompare(right.id));
  const selected = [];
  const skipped = [];
  let totalBytes = 0;

  for (const item of ordered) {
    const current = item.authority === "current";
    const matchingTags = item.tags.filter((tag) => requestedTags.includes(tag));
    if (!current) skipped.push({ ...item, reason: "stale" });
    else if (!item.mandatory && matchingTags.length === 0) skipped.push({ ...item, reason: "irrelevant" });
    else if (totalBytes + item.bytes > maximumBytes) {
      if (item.mandatory) throw new Error("Budget cannot fit mandatory context");
      skipped.push({ ...item, reason: "budget" });
    } else {
      const reason = item.mandatory ? "mandatory" : matchingTags.some((tag) => questionTags.includes(tag)) ? "question" : "task";
      selected.push({ ...item, reason });
      totalBytes += item.bytes;
    }
  }

  const covered = new Set(selected.flatMap((item) => item.tags));
  return { selected, skipped, totalBytes, remainingBytes: maximumBytes - totalBytes, maximumBytes, requestedTags, unresolvedTags: requestedTags.filter((tag) => !covered.has(tag)) };
}
