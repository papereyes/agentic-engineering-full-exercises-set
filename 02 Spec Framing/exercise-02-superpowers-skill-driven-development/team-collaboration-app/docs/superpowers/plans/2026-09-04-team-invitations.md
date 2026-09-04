# Team Invitations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visible Team Invitations interface whose shared service enforces authorization, guest policy, normalized uniqueness, configured expiry, single-use lifecycle transitions, and immutable rejection behavior.

**Architecture:** Implement the lifecycle as three pure functions in the existing invitation service, reusing the existing policy helper and domain types. Keep `App.tsx` as a thin local-state interface that delegates create, accept, and revoke actions to that service and updates state only from service results.

**Tech Stack:** TypeScript 5.9, React 19, native Node test runner/assertions, CSS, Vite

**Spec:** `docs/superpowers/specs/2026-09-04-team-invitations-design.md`

## Global Constraints

- Add no dependency, persistence layer, route, API, email transport, delivery token, or authentication system.
- Treat emails case-insensitively after trimming and lowercasing.
- Complete every validation before constructing changed member or invitation arrays.
- Return the supplied state unchanged for every rejected action.
- Use `policy.defaultInviteExpiryDays` and `policy.allowGuestInvites` directly.
- Do not change protected tests, types, fixtures, policy helpers, or challenge files.

---

### Task 1: Invitation Lifecycle Service

**Files:**
- Modify: `src/services/invitationService.ts`
- Test: `tests/invitationService.test.ts` (run unchanged)
- Create: `evidence/tdd.md`

**Interfaces:**
- Consumes: `canManageInvitations(member, policy)` and the existing `InvitationState`, `CreateInvitationInput`, `AcceptInvitationInput`, `RevokeInvitationInput`, and `InvitationActionResult` types.
- Produces: `createInvitation(state, input)`, `acceptInvitation(state, input)`, and `revokeInvitation(state, input)`, each returning `InvitationActionResult` without mutating `state`.

- [ ] **Step 1: Run the protected contract against the starter service and record Red**

Run:

```bash
npm run test:invitations
```

Expected: exit code 1 because `createInvitation` throws `Invitation lifecycle is not implemented`.

Create `evidence/tdd.md` with the exact command and observed failure:

```markdown
# Test-Driven Development Evidence

## Red

- Command: `npm run test:invitations`
- Result: exit code 1; the first lifecycle test failed because the starter `createInvitation` threw `Invitation lifecycle is not implemented`.

## Green

- Command: `npm run test:invitations`
- Result: Record the observed passing count and exit code after Step 5.
```

- [ ] **Step 2: Implement shared validation and creation**

In `src/services/invitationService.ts`, import `canManageInvitations` and add only these private helpers:

```ts
const reject = (state: InvitationState, code: InvitationErrorCode): InvitationActionResult => ({
  ok: false,
  state,
  code
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isExpired = (expiresAt: string, now: string) => Date.parse(expiresAt) <= Date.parse(now);
```

Implement `createInvitation` in this validation order: authorized actor; valid target role; guest policy; normalized valid email; existing normalized member email; unexpired pending invitation email; unique invitation identifier. Construct `createdAt` from `input.now`, calculate `expiresAt` by adding `state.policy.defaultInviteExpiryDays * 86_400_000`, and return a copied invitation array only after all checks pass.

- [ ] **Step 3: Implement acceptance**

Find the invitation without changing state, then reject `INVITATION_NOT_FOUND`, `INVITATION_FINAL`, `INVITATION_EXPIRED`, or `DUPLICATE_MEMBER_ID` as applicable. On success, map the matching invitation to status `accepted` and append exactly this member shape:

```ts
{
  id: input.memberId,
  name: invitation.email,
  email: invitation.email,
  role: invitation.role,
  status: "active",
  lastActiveDays: 0
}
```

- [ ] **Step 4: Implement revocation**

Authorize `input.actorId` through `canManageInvitations`, then reject missing, finalized, or expired invitations with the corresponding existing error code. On success, map only the matching invitation to status `revoked`; keep the members array unchanged.

- [ ] **Step 5: Run the lifecycle contract and record Green**

Run:

```bash
npm run test:invitations
```

Expected: exit code 0 with all 16 tests passing. Replace the pending Green result in `evidence/tdd.md` with the actual passing output summary.

- [ ] **Step 6: Commit the service task**

```bash
git add src/services/invitationService.ts evidence/tdd.md
git commit -m "feat: implement invitation lifecycle"
```

---

### Task 2: Team Invitations Interface

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `createInvitation`, `acceptInvitation`, and `revokeInvitation` from `src/services/invitationService.ts`; `members` and `workspacePolicy` from `src/data/team.ts`.
- Produces: a visible `Team Invitations` section with create, accept, and revoke controls backed by one local `InvitationState`.

- [ ] **Step 1: Establish a failing interface check**

Run:

```bash
npm run submission:verify
```

Expected: exit code 1 including `the application must contain a visible Team Invitations section` or `the Team Invitations interface must use the shared invitation service`.

- [ ] **Step 2: Add local state and lifecycle handlers**

In `src/App.tsx`, initialize one state value:

```ts
const [team, setTeam] = useState<InvitationState>({ members, invitations: [], policy: workspacePolicy });
```

Keep controlled values for actor, email, target role, and feedback. Generate client-only identifiers from the current array lengths plus a timestamp. Each handler calls the matching service with `new Date().toISOString()`, calls `setTeam(result.state)` only when `result.ok`, and otherwise displays `result.code`.

- [ ] **Step 3: Render accessible native controls**

Add a `<section aria-labelledby="team-invitations-title">` containing the exact heading `Team Invitations`. Use labeled `<select>`, `<input type="email">`, and `<button>` elements. List active owners/admins as actor options, disable the guest option when `workspacePolicy.allowGuestInvites` is false, and render every invitation with status and expiry. Show accept and revoke buttons only for pending invitations.

Use the selected actor for revocation and generate a unique member identifier for acceptance. Keep the existing member cards, changing them to render `team.members` so accepted invitations become visible.

- [ ] **Step 4: Add minimal layout styles**

In `src/styles.css`, reuse the existing border, background, spacing, and text colors. Add only selectors needed for the invitation section, form grid, feedback line, invitation list, and button row. Include visible `:focus-visible` outlines and do not introduce animation or decorative assets.

- [ ] **Step 5: Verify interface compilation and wiring**

Run:

```bash
npm run typecheck
npm run build
npm run lint
```

Expected: every command exits 0 with no TypeScript, build, or lint errors.

- [ ] **Step 6: Commit the interface task**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: add team invitations interface"
```

---

### Task 3: Exercise Evidence, Review, and Final Verification

**Files:**
- Create: `evidence/before.md`
- Create: `evidence/before.patch`
- Create: `evidence/after.md`
- Create: `evidence/after.patch`
- Create: `evidence/comparison.md`
- Create: `evidence/skill-usage.md`
- Create: `evidence/review.md`
- Modify: `evidence/tdd.md`

**Interfaces:**
- Consumes: the approved design, implementation plan, Git history, protected verification commands, and the repository's existing unstructured-run commit `99829be`.
- Produces: truthful workflow evidence accepted by `scripts/verify-submission.mjs`.

- [ ] **Step 1: Recover the existing unstructured-run evidence**

Use the repository's recorded evidence commit rather than inventing a comparison. The full repository path is required because the evidence files live below the exercise path. This command correction was made after final review; the original plan incorrectly named implementation commit `99829be` and omitted the repository-root path:

```bash
git show d767419736f47a41129bb67d61b1bd120b01f45e:'02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/evidence/before.md'
git show d767419736f47a41129bb67d61b1bd120b01f45e:'02 Spec Framing/exercise-02-superpowers-skill-driven-development/team-collaboration-app/evidence/before.patch'
```

Copy those exact tracked artifacts to `evidence/before.md` and `evidence/before.patch`. Confirm they identify attempt 1, the exact supplied prompt, Superpowers disabled, and a genuine patch containing both `src/services/invitationService.ts` and `src/App.tsx`.

- [ ] **Step 2: Capture the current implementation patch**

Generate `evidence/after.patch` from the starter parent through the completed implementation commits so it contains changes to both `src/services/invitationService.ts` and `src/App.tsx`:

```bash
git diff --binary --full-index 52090edddf032d026ece16ef90feb627bf8e67ac ab46b7dcccf3d9e06b4e8fbfeff79f852566309b
```

Record the current session conditions and exact prompt in `evidence/after.md`. Include the observed results for `npm run test:invitations`, `npm run submission:verify`, and `npm run agent:check`, and identify the Superpowers design, planning, execution, TDD, review, and verification workflow.

- [ ] **Step 3: Record skill usage and comparison**

In `evidence/skill-usage.md`, list these skills in actual chronological order: `superpowers:brainstorming`, `superpowers:writing-plans`, `superpowers:subagent-driven-development` or `superpowers:executing-plans`, `superpowers:test-driven-development`, `superpowers:requesting-code-review`, and `superpowers:verification-before-completion`. Record the design approval, design artifact, plan artifact, and installed Superpowers version or commit.

In `evidence/comparison.md`, state why agent, model, tools, permissions, prompt, time limit, and attempt number match. Compare authorization, normalized duplicate email handling, guest policy, expiry, single-use transitions, and immutable rejection behavior using only observed patch and test evidence.

- [ ] **Step 4: Request code review and resolve findings**

Invoke `superpowers:requesting-code-review` against the implementation diff. Record each finding's severity and resolution in `evidence/review.md`; if there are no findings, record `No findings`, the reviewed commit range, and the verification commands used. Resolve any correctness issue before proceeding.

- [ ] **Step 5: Run fresh final verification**

Run separately and record exact exit results:

```bash
npm run test:invitations
npm run submission:verify
npm run agent:check
```

Expected: all three exit 0. If submission verification fails because evidence is incomplete, correct only the reported evidence gap and rerun it.

- [ ] **Step 6: Commit evidence**

```bash
git add evidence docs/superpowers/plans/2026-09-04-team-invitations.md
git commit -m "docs: record invitation workflow evidence"
```
