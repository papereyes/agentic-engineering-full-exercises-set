import type { ActionDraft, WorkItem } from "../types";
import { workItems } from "../data/workItems";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const cacheKey = "workflow-items";

function loadCachedItems(): WorkItem[] | null {
  const cached = window.localStorage.getItem(cacheKey);
  if (!cached) return null;
  try {
    const parsed: unknown = JSON.parse(cached);
    if (Array.isArray(parsed)) return parsed as WorkItem[];
  } catch {
    // Invalid browser state falls back to the source data below.
  }
  window.localStorage.removeItem(cacheKey);
  return null;
}

export async function fetchWorkItems(): Promise<WorkItem[]> {
  await wait(220);
  return loadCachedItems() ?? [...workItems].sort((left, right) => left.dueInDays - right.dueInDays);
}

export async function saveAction(itemId: string, draft: ActionDraft): Promise<WorkItem> {
  await wait(180);
  const items = loadCachedItems() ?? workItems;
  const item = items.find((candidate) => candidate.id === itemId);
  if (!item) {
    throw new Error("Work item was not found");
  }

  const updated = {
    ...item,
    status: draft.status,
    owner: draft.owner,
    note: draft.note,
  };
  window.localStorage.setItem(cacheKey, JSON.stringify(items.map((candidate) => candidate.id === itemId ? updated : candidate)));
  return updated;
}

export async function collectEvidence(item: WorkItem): Promise<string[]> {
  await wait(140);
  return [
    `Risk score: ${item.score}`,
    `Owner: ${item.owner}`,
    `Tags: ${item.tags.join(", ")}`,
  ];
}
