# Review: request changes

Base SHA: `10cabb58a4fca455ae80397c1ca54b2298f50e8a`. Head SHA: `9283dc1e539af1ab72c6b618c197d7870d1217dc`. Reviewed protected range `review-base..review-head`. The implementation is not safe to merge until the five confirmed blockers below are fixed. The independent Semgrep replay produced two results; one is confirmed and one is dismissed with direct trust-boundary evidence.

## HTML-001 — High — confirmed

`src/components/ActionComposer.tsx` adds `<div className="review-preview" dangerouslySetInnerHTML={{ __html: note }} />`. A persisted reviewer note can contain attacker-controlled markup, so opening the item executes that markup in another user's browser. Render the note through React text interpolation. The `[HTML-001]` regression in `tests/review-regressions.test.ts` proves no image element is created and the original text remains visible.

## STATUS-001 — High — confirmed

`src/components/ActionComposer.tsx` derives Ready from `item.priority === "High" && note.toLowerCase().includes("approved") ? "Ready" : status;`. Free-form prose must not override an explicit workflow selection. A blocked item with an ordinary note can otherwise be promoted silently. Submit the selected status unchanged; `[STATUS-001]` verifies the saved draft stays Blocked.

## VALIDATION-001 — Medium — confirmed

The changed `<button onClick={submit} disabled={saving}>` removes both the explicit non-submit type and the minimum-note guard. This admits invalid drafts and can submit a containing form unexpectedly. Restore `type="button"` and disable saving while the trimmed note is shorter than eight characters. `[VALIDATION-001]` verifies both properties.

## A11Y-001 — Medium — confirmed

`src/components/WorkQueue.tsx` replaces the interactive button with `<div`. A click handler does not provide focusability, keyboard activation, or button semantics. Keep the existing native button instead of recreating its behavior. `[A11Y-001]` locates the item by button role and verifies selection.

## POLICY-001 — Critical — confirmed

`src/server/reviewPolicy.ts` adds `if (draft.note.toLowerCase().includes("approved")) return;`. This makes untrusted note text a server-side bypass for both note validation and forbidden blocked/escalated transitions. Restore the unconditional checks. `[POLICY-001]` exercises a direct policy call so the boundary remains protected independently of the UI.

## STATIC-001 — Info — dismissed

Semgrep also reports `return <aside dangerouslySetInnerHTML={{ __html: trustedAnnouncement }} />;` in `src/components/SafeAnnouncement.tsx`. The value is the module-local constant `<strong>Review queue ready.</strong>`; the component accepts no props and reads no state, storage, URL, or network input. The sink is undesirable as a general pattern, but this exact protected result has no attacker-controlled source and is therefore not a blocker for this change.

## Verification

The protected bundle reproduces exactly as `review-base..review-head`. The same five learner tests fail against the vulnerable head and pass at source commit `039b4443dc2850aebc9e3f7b5ac9fc525feaed6f`. All 15 focused review tests pass, and the Semgrep replay reproduces both protected-head results for explicit triage.
