import type {
  AcceptInvitationInput,
  CreateInvitationInput,
  InvitationActionResult,
  InvitationState,
  RevokeInvitationInput
} from "../types";
import type { InvitationErrorCode } from "../types";
// @ts-expect-error Node's TypeScript test runner requires the source extension.
import { canManageInvitations } from "./teamPolicy.ts";

const reject = (state: InvitationState, code: InvitationErrorCode): InvitationActionResult => ({ ok: false, state, code });
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isExpired = (expiresAt: string, now: string) => Date.parse(expiresAt) <= Date.parse(now);

export function createInvitation(state: InvitationState, input: CreateInvitationInput): InvitationActionResult {
  const actor = state.members.find((member) => member.id === input.actorId);
  if (!actor || !canManageInvitations(actor, state.policy)) return reject(state, "UNAUTHORIZED");
  if (input.role !== "member" && input.role !== "guest") return reject(state, "INVALID_ROLE");
  if (input.role === "guest" && !state.policy.allowGuestInvites) return reject(state, "GUEST_DISABLED");
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) return reject(state, "INVALID_EMAIL");
  if (state.members.some((member) => normalizeEmail(member.email) === email)) return reject(state, "MEMBER_EXISTS");
  if (state.invitations.some((invitation) => invitation.status === "pending" && normalizeEmail(invitation.email) === email && !isExpired(invitation.expiresAt, input.now))) {
    return reject(state, "INVITATION_PENDING");
  }
  if (state.invitations.some((invitation) => invitation.id === input.invitationId)) return reject(state, "DUPLICATE_INVITATION_ID");
  const invitation = {
    id: input.invitationId,
    email,
    role: input.role,
    invitedBy: input.actorId,
    createdAt: input.now,
    expiresAt: new Date(Date.parse(input.now) + state.policy.defaultInviteExpiryDays * 86_400_000).toISOString(),
    status: "pending" as const
  };
  return { ok: true, state: { ...state, invitations: [...state.invitations, invitation] }, invitation };
}

export function acceptInvitation(state: InvitationState, input: AcceptInvitationInput): InvitationActionResult {
  const invitation = state.invitations.find(({ id }) => id === input.invitationId);
  if (!invitation) return reject(state, "INVITATION_NOT_FOUND");
  if (invitation.status !== "pending") return reject(state, "INVITATION_FINAL");
  if (isExpired(invitation.expiresAt, input.now)) return reject(state, "INVITATION_EXPIRED");
  if (state.members.some((member) => member.id === input.memberId)) return reject(state, "DUPLICATE_MEMBER_ID");
  const accepted = { ...invitation, status: "accepted" as const };
  const email = normalizeEmail(invitation.email);
  return {
    ok: true,
    state: {
      ...state,
      members: [...state.members, { id: input.memberId, name: email, email, role: invitation.role, status: "active", lastActiveDays: 0 }],
      invitations: state.invitations.map((item) => item.id === invitation.id ? accepted : item)
    },
    invitation: accepted
  };
}

export function revokeInvitation(state: InvitationState, input: RevokeInvitationInput): InvitationActionResult {
  const actor = state.members.find((member) => member.id === input.actorId);
  if (!actor || !canManageInvitations(actor, state.policy)) return reject(state, "UNAUTHORIZED");
  const invitation = state.invitations.find(({ id }) => id === input.invitationId);
  if (!invitation) return reject(state, "INVITATION_NOT_FOUND");
  if (invitation.status !== "pending") return reject(state, "INVITATION_FINAL");
  if (isExpired(invitation.expiresAt, input.now)) return reject(state, "INVITATION_EXPIRED");
  const revoked = { ...invitation, status: "revoked" as const };
  return { ok: true, state: { ...state, invitations: state.invitations.map((item) => item.id === invitation.id ? revoked : item) }, invitation: revoked };
}
