/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActionComposer } from "../src/components/ActionComposer";
import { WorkQueue } from "../src/components/WorkQueue";
import { assertAllowedTransition } from "../src/server/reviewPolicy";
import type { ActionDraft, WorkItem } from "../src/types";

const item: WorkItem = {
  id: "review-1",
  name: "Atlas",
  priority: "High",
  status: "Blocked",
  score: 91,
  summary: "Needs review",
  note: "<img src=x onerror=alert(1)>",
  owner: "Asha",
  dueInDays: 0,
  tags: ["review"],
};

afterEach(cleanup);

describe("review gauntlet regressions", () => {
  it("[HTML-001] renders reviewer notes as text", () => {
    const { container } = render(createElement(ActionComposer, { item, onSave: async () => {} }));

    expect(container.querySelector(".review-preview img")).toBeNull();
    expect(container.querySelector(".review-preview")?.textContent).toBe(item.note);
  });

  it("[STATUS-001] submits the reviewer-selected status without note-driven promotion", async () => {
    const onSave = vi.fn(async (_draft: ActionDraft) => {});
    render(createElement(ActionComposer, { item: { ...item, note: "approved by reviewer" }, onSave }));

    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));

    await vi.waitFor(() => expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ status: "Blocked" })));
  });

  it("[VALIDATION-001] prevents submission of a short reviewer note", () => {
    render(createElement(ActionComposer, { item: { ...item, note: "short" }, onSave: async () => {} }));

    const save = screen.getByRole("button", { name: "Save draft" }) as HTMLButtonElement;
    expect(save.type).toBe("button");
    expect(save.disabled).toBe(true);
  });

  it("[A11Y-001] exposes each queue item as a native button", () => {
    const onSelect = vi.fn();
    render(createElement(WorkQueue, { items: [item], selectedId: item.id, onSelect }));

    const action = screen.getByRole("button", { name: /Atlas/ });
    fireEvent.click(action);
    expect(onSelect).toHaveBeenCalledWith(item);
  });

  it("[POLICY-001] enforces note and transition rules even when text says approved", () => {
    expect(() => assertAllowedTransition(item, { owner: "Asha", note: "approved by reviewer", status: "Ready" })).toThrow(/cannot transition/);
    expect(() => assertAllowedTransition({ ...item, status: "In Review" }, { owner: "Asha", note: "short", status: "In Review" })).toThrow(/meaningful reviewer note/);
  });
});
