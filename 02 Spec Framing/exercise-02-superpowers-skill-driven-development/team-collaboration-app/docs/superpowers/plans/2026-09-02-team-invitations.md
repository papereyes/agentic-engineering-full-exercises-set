# Team Invitations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete create, list, accept, and revoke invitation lifecycle with policy enforcement and immutable rejection behavior.

**Architecture:** `src/services/invitationService.ts` remains the pure domain boundary and reuses `canManageInvitations`; `src/App.tsx` owns the current `InvitationState` and delegates every action to that service. Native React and browser APIs cover state, forms, identifiers, and timestamps without another dependency.

**Tech Stack:** TypeScript 5.9, React 19, Vite 7, Node 22 test runner

**Spec:** `docs/superpowers/specs/2026-09-02-team-invitations-design.md`

## Global Constraints

- Do not modify protected starter inputs, including `tests/invitationService.test.ts`.
- Run GitNexus `impact` before editing each existing function and warn before proceeding if risk is HIGH or CRITICAL.
- Run GitNexus `detect_changes` after implementation and before any commit attempt.
- Use `canManageInvitations` as the shared actor-policy rule; do not call `src/legacy/quickInvite.ts`.
- Validate before constructing changed state; every rejected result must preserve member and invitation data.
- Add no dependencies, persistence layer, reducer, service class, or speculative abstraction.
- The repository `.git` directory is read-only in this session; retain exact commit commands for execution in a writable checkout.

## File Structure

- `src/services/invitationService.ts`: pure creation, acceptance, and revocation rules.
- `src/App.tsx`: full lifecycle UI and React state owner.
- `src/styles.css`: existing stylesheet extended for the form, invitation list, actions, and responsive layout.
- `evidence/`: required before/after comparison, TDD, skill usage, review, and patch records.

---

### Task 1: Preserve the Existing Before Run

**Files:**
- Create: `evidence/before.md`
- Create: `evidence/before.patch`

**Interfaces:**
- Consumes: committed artifacts at `exercise-02-02-before:evidence/before.md` and `exercise-02-02-before:evidence/before.patch`.
- Produces: unchanged baseline evidence used by the final comparison and submission verifier.

- [ ] **Step 1: Read the historical artifacts**

Run from the repository root:

```bash
rtk git show 'exercise-02-02-before:02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/evidence/before.md'
rtk git show 'exercise-02-02-before:02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/evidence/before.patch'
```

Expected: the Markdown identifies the no-Superpowers run and the patch changes both `src/services/invitationService.ts` and `src/App.tsx`.

- [ ] **Step 2: Add those exact committed contents with `apply_patch`**

Do not edit run conditions, hashes, results, or findings. The source is the existing before-run commit, not a reconstructed run.

- [ ] **Step 3: Verify the copied baseline**

Run:

```bash
rtk diff evidence/before.md <(git show 'exercise-02-02-before:02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/evidence/before.md')
rtk diff evidence/before.patch <(git show 'exercise-02-02-before:02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/evidence/before.patch')
```

Expected: both commands produce no diff.

---

### Task 2: Implement the Pure Invitation Lifecycle

**Files:**
- Modify: `src/services/invitationService.ts`
- Test: `tests/invitationService.test.ts` (run unchanged)
- Create: `evidence/tdd.md`

**Interfaces:**
- Consumes: `InvitationState`, the three input types, `InvitationActionResult`, and `canManageInvitations(member, policy): boolean`.
- Produces: `createInvitation(state, input)`, `acceptInvitation(state, input)`, and `revokeInvitation(state, input)`, each returning `InvitationActionResult` without mutating its input.

- [ ] **Step 1: Record symbol blast radius**

Run upstream GitNexus impact analysis for `createInvitation`, `acceptInvitation`, and `revokeInvitation` in `src/services/invitationService.ts`. Report direct callers, affected processes, and risk. Stop for user confirmation if any result is HIGH or CRITICAL.

- [ ] **Step 2: Run the supplied contract and record RED**

Run:

```bash
rtk npm run test:invitations
```

Expected: exit code 1 with the starter message that the lifecycle is not implemented. Add this command, exit code, and failure text under `## Red` in `evidence/tdd.md` before editing production code.

- [ ] **Step 3: Implement the minimum domain service**

Replace only the throwing bodies and add small shared helpers in the same file:

```ts
import { canManageInvitations } from "./teamPolicy";

const reject = (state: InvitationState, code: InvitationActionResult["code"]): InvitationActionResult => ({
  ok: false,
  state,
  code
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function createInvitation(state: InvitationState, input: CreateInvitationInput): InvitationActionResult {
  const actor = state.members.find((member) => member.id === input.actorId);
  if (!actor || !canManageInvitations(actor, state.policy)) return reject(state, "UNAUTHORIZED");
  if (input.role !== "member" && input.role !== "guest") return reject(state, "INVALID_ROLE");
  if (input.role === "guest" && !state.policy.allowGuestInvites) return reject(state, "GUEST_DISABLED");

  const email = normalizeEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reject(state, "INVALID_EMAIL");
  if (state.members.some((member) => normalizeEmail(member.email) === email)) return reject(state, "MEMBER_EXISTS");
  if (state.invitations.some((invitation) =>
    invitation.status === "pending" &&
    Date.parse(invitation.expiresAt) > Date.parse(input.now) &&
    normalizeEmail(invitation.email) === email
  )) return reject(state, "INVITATION_PENDING");
  if (state.invitations.some((invitation) => invitation.id === input.invitationId)) {
    return reject(state, "DUPLICATE_INVITATION_ID");
  }

  const invitation = {
    id: input.invitationId,
    email,
    role: input.role,
    invitedBy: input.actorId,
    createdAt: input.now,
    expiresAt: new Date(
      Date.parse(input.now) + state.policy.defaultInviteExpiryDays * 86_400_000
    ).toISOString(),
    status: "pending" as const
  };
  return { ok: true, state: { ...state, invitations: [...state.invitations, invitation] }, invitation };
}

export function acceptInvitation(state: InvitationState, input: AcceptInvitationInput): InvitationActionResult {
  const invitation = state.invitations.find((item) => item.id === input.invitationId);
  if (!invitation) return reject(state, "INVITATION_NOT_FOUND");
  if (invitation.status !== "pending") return reject(state, "INVITATION_FINAL");
  if (Date.parse(invitation.expiresAt) <= Date.parse(input.now)) return reject(state, "INVITATION_EXPIRED");
  if (state.members.some((member) => member.id === input.memberId)) return reject(state, "DUPLICATE_MEMBER_ID");

  const accepted = { ...invitation, status: "accepted" as const };
  const email = normalizeEmail(invitation.email);
  return {
    ok: true,
    state: {
      ...state,
      invitations: state.invitations.map((item) => item.id === invitation.id ? accepted : item),
      members: [...state.members, {
        id: input.memberId,
        name: email,
        email,
        role: invitation.role,
        status: "active",
        lastActiveDays: 0
      }]
    },
    invitation: accepted
  };
}

export function revokeInvitation(state: InvitationState, input: RevokeInvitationInput): InvitationActionResult {
  const actor = state.members.find((member) => member.id === input.actorId);
  if (!actor || !canManageInvitations(actor, state.policy)) return reject(state, "UNAUTHORIZED");

  const invitation = state.invitations.find((item) => item.id === input.invitationId);
  if (!invitation) return reject(state, "INVITATION_NOT_FOUND");
  if (invitation.status !== "pending") return reject(state, "INVITATION_FINAL");
  if (Date.parse(invitation.expiresAt) <= Date.parse(input.now)) return reject(state, "INVITATION_EXPIRED");

  const revoked = { ...invitation, status: "revoked" as const };
  return {
    ok: true,
    state: {
      ...state,
      invitations: state.invitations.map((item) => item.id === invitation.id ? revoked : item)
    },
    invitation: revoked
  };
}
```

- [ ] **Step 4: Run the contract and record GREEN**

Run:

```bash
rtk npm run test:invitations
```

Expected: exit code 0 and 16 passing tests. Add the command, exit code, and pass count under `## Green` in `evidence/tdd.md`.

- [ ] **Step 5: Verify types**

Run:

```bash
rtk npm run typecheck
```

Expected: exit code 0.

- [ ] **Step 6: Commit when Git metadata is writable**

```bash
git add src/services/invitationService.ts evidence/tdd.md
git commit -m "feat: implement invitation lifecycle"
```

---

### Task 3: Wire the Full Lifecycle UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Test: `scripts/verify-submission.mjs` (run unchanged)

**Interfaces:**
- Consumes: `InvitationState`, `InvitationRole`, all three invitation service functions, seeded `members` and `workspacePolicy`, and `canManageInvitations`.
- Produces: a visible `Team Invitations` section with creation form, current invitation list, Accept and Revoke controls, and an `aria-live` result message.

- [ ] **Step 1: Record the App blast radius**

Run upstream GitNexus impact analysis for `App` in `src/App.tsx`. Report direct callers, affected processes, and risk. Stop for user confirmation if risk is HIGH or CRITICAL.

- [ ] **Step 2: Run the UI contract and confirm RED**

Run:

```bash
rtk npm run submission:verify
```

Expected output includes both `the application must contain a visible Team Invitations section` and `the Team Invitations interface must use the shared invitation service`. Other evidence-related failures are expected at this stage.

- [ ] **Step 3: Implement the state adapter and interface**

In `src/App.tsx`, import `useState`, the three service functions, `InvitationRole`, and `InvitationState`. Initialize state as:

```ts
const [state, setState] = useState<InvitationState>({ members, invitations: [], policy: workspacePolicy });
const [actorId, setActorId] = useState("USR-201");
const [message, setMessage] = useState("");
```

Add three handlers. Each must call the service, update React state only for `result.ok`, and always announce its result:

```ts
function invite(form: FormData) {
  const result = createInvitation(state, {
    invitationId: crypto.randomUUID(),
    actorId,
    email: String(form.get("email")),
    role: String(form.get("role")) as InvitationRole,
    now: new Date().toISOString()
  });
  if (result.ok) setState(result.state);
  setMessage(result.ok ? `Invitation sent to ${result.invitation?.email}.` : `Invitation rejected: ${result.code}.`);
}

function accept(invitationId: string) {
  const result = acceptInvitation(state, {
    invitationId,
    memberId: crypto.randomUUID(),
    now: new Date().toISOString()
  });
  if (result.ok) setState(result.state);
  setMessage(result.ok ? "Invitation accepted." : `Acceptance rejected: ${result.code}.`);
}

function revoke(invitationId: string) {
  const result = revokeInvitation(state, { invitationId, actorId, now: new Date().toISOString() });
  if (result.ok) setState(result.state);
  setMessage(result.ok ? "Invitation revoked." : `Revocation rejected: ${result.code}.`);
}
```

Render a `<section className="invitations" aria-labelledby="invitations-heading">` before the member grid. Include the exact heading `Team Invitations`, policy summary, labelled actor/email/role controls, submit button, `aria-live="polite"` message, empty state, and mapped invitation cards. Show Accept and Revoke buttons only while `invitation.status === "pending"`. Change the member grid to render `state.members` so accepted members appear.

- [ ] **Step 4: Extend the existing stylesheet**

Add styles for `.invitations`, `.invite-form`, `.invite-form label`, shared form controls/buttons, `.message`, `.invitation-list`, `.invitation-card`, and `.actions`. Reuse the existing border, background, spacing, and text colors. Use the existing responsive grid pattern; add no animation, theme system, or CSS dependency.

- [ ] **Step 5: Verify the UI contract no longer reports UI failures**

Run:

```bash
rtk npm run submission:verify
```

Expected: the two UI-specific failures from Step 2 are absent. Evidence-related failures may remain until Task 4.

- [ ] **Step 6: Verify compilation**

Run separately:

```bash
rtk npm run typecheck
rtk npm run build
```

Expected: both exit with code 0.

- [ ] **Step 7: Commit when Git metadata is writable**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: add team invitations interface"
```

---

### Task 4: Review, Evidence, and Final Verification

**Files:**
- Create: `evidence/after.md`
- Create: `evidence/after.patch`
- Create: `evidence/comparison.md`
- Create: `evidence/skill-usage.md`
- Create: `evidence/review.md`
- Modify: `evidence/tdd.md`

**Interfaces:**
- Consumes: completed implementation, historical before evidence, approved spec and plan, command results, and code-review findings.
- Produces: all artifacts required by `scripts/verify-submission.mjs` and a verified final diff.

- [ ] **Step 1: Run the requesting-code-review workflow**

Review `src/services/invitationService.ts`, `src/App.tsx`, and `src/styles.css` against the spec and supplied tests. Record each finding with severity, resolution, and verification in `evidence/review.md`; if there are no findings, explicitly record `No findings`, `Resolution: none required`, and the verification commands.

- [ ] **Step 2: Fix findings with TDD**

For any behavioral finding, first add or identify a failing executable check, run it to confirm the expected failure, make the smallest correction after the required GitNexus impact analysis, and rerun the check. Append the red/green commands and outputs to `evidence/tdd.md`.

- [ ] **Step 3: Run GitNexus change detection**

Run `detect_changes({scope: "compare", base_ref: "main"})`. Confirm changed symbols and affected flows are limited to the invitation service and UI; investigate any unexpected symbol before continuing.

- [ ] **Step 4: Capture the after patch**

From the repository root, inspect the source diff from the shared starting commit:

```bash
rtk git diff 52090edddf032d026ece16ef90feb627bf8e67ac -- '02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/src/services/invitationService.ts' '02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/src/App.tsx' '02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/src/styles.css'
```

Add that exact output to `evidence/after.patch` with `apply_patch`. It must contain genuine `diff --git` entries for `src/services/invitationService.ts` and `src/App.tsx` and differ from `evidence/before.patch`.

- [ ] **Step 5: Write exact workflow evidence**

Create:

- `evidence/after.md` with the same Agent, Model, Tools, Permissions, Time limit, Attempt `1`, and exact Prompt values as `before.md`, followed by the actual results of `npm run test:invitations`, `npm run submission:verify`, and `npm run agent:check`.
- `evidence/skill-usage.md` listing, in execution order, `superpowers:brainstorming`, design approval, the design artifact, `superpowers:writing-plans`, the plan artifact, the selected execution skill, `superpowers:test-driven-development`, `superpowers:requesting-code-review`, and `superpowers:verification-before-completion`. Record the installed Superpowers version or commit.
- `evidence/comparison.md` explaining identical run conditions and comparing authorization, case-normalized duplicates, guest policy, expiry, single-use acceptance/revocation, immutable rejection, planning, and review between the before and after runs.

Use observed command results only; do not claim a pass before the command has exited successfully.

- [ ] **Step 6: Run verification-before-completion**

Run separately:

```bash
rtk npm run test:invitations
rtk npm run submission:verify
rtk npm run agent:check
rtk npm run lint
rtk npm run format
rtk npm run typecheck
rtk npm run build
rtk npm run verify:exercise
```

Expected: every command exits with code 0, invitation output reports 16 passing tests, and submission verification reports complete workflow evidence.

- [ ] **Step 7: Commit when Git metadata is writable**

```bash
git add docs/superpowers evidence src
git commit -m "feat: complete team invitation workflow"
```
