import assert from "node:assert/strict";
import { test } from "node:test";

import { acceptInvitation } from "../src/services/invitationService.ts";
import type { InvitationState } from "../src/types.ts";

test("acceptance normalizes the invitation email before constructing the member", () => {
  const state: InvitationState = {
    members: [],
    invitations: [{
      id: "INV-1",
      email: " Mixed@Example.Test ",
      role: "member",
      invitedBy: "USR-1",
      createdAt: "2026-09-01T00:00:00.000Z",
      expiresAt: "2026-09-10T00:00:00.000Z",
      status: "pending"
    }],
    policy: { inviteRoles: ["owner", "admin"], defaultInviteExpiryDays: 7, allowGuestInvites: false }
  };

  const result = acceptInvitation(state, {
    invitationId: "INV-1",
    memberId: "USR-2",
    now: "2026-09-04T00:00:00.000Z"
  });

  assert.equal(result.ok, true);
  assert.equal(result.state.members[0].name, "mixed@example.test");
  assert.equal(result.state.members[0].email, "mixed@example.test");
});
