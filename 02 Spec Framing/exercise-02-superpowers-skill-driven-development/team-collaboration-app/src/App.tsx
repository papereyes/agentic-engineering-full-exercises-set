import { useState } from "react";
import { members, workspacePolicy } from "./data/team";
import { acceptInvitation, createInvitation, revokeInvitation } from "./services/invitationService";
import { canManageInvitations, summarizeMemberAccess } from "./services/teamPolicy";
import type { InvitationRole, InvitationState } from "./types";

export default function App() {
  const [state, setState] = useState<InvitationState>({ members, invitations: [], policy: workspacePolicy });
  const [actorId, setActorId] = useState("USR-201");
  const [message, setMessage] = useState("");

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

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Workspace admin</p>
        <h1>Team collaboration console</h1>
        <p>Manage workspace members and invitation access in one place.</p>
      </section>

      <section className="invitations" aria-labelledby="invitations-heading">
        <div>
          <p className="eyebrow">Access management</p>
          <h2 id="invitations-heading">Team Invitations</h2>
          <p>
            Invitations expire after {state.policy.defaultInviteExpiryDays} days. Guest invitations are{" "}
            {state.policy.allowGuestInvites ? "enabled" : "disabled"}.
          </p>
        </div>

        <form action={invite} className="invite-form">
          <label>
            Invited by
            <select value={actorId} onChange={(event) => setActorId(event.target.value)}>
              {state.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role}, {member.status})
                </option>
              ))}
            </select>
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Role
            <select name="role">
              <option value="member">Member</option>
              <option value="guest" disabled={!state.policy.allowGuestInvites}>
                Guest
              </option>
            </select>
          </label>
          <button type="submit">Send invitation</button>
        </form>

        <p className="message" aria-live="polite">
          {message}
        </p>
        <div className="invitation-list">
          {state.invitations.length === 0 && <p>No invitations yet.</p>}
          {state.invitations.map((invitation) => (
            <article className="invitation-card" key={invitation.id}>
              <div>
                <strong>{invitation.email}</strong>
                <p>
                  {invitation.role} · {invitation.status} · invited by {invitation.invitedBy} · expires{" "}
                  {new Date(invitation.expiresAt).toLocaleDateString()}
                </p>
              </div>
              {invitation.status === "pending" && (
                <div className="actions">
                  <button type="button" onClick={() => accept(invitation.id)}>
                    Accept
                  </button>
                  <button type="button" className="secondary" onClick={() => revoke(invitation.id)}>
                    Revoke
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="member-grid">
        {state.members.map((member) => (
          <article className="member-card" key={member.id}>
            <div>
              <p className="eyebrow">{member.id}</p>
              <h2>{member.name}</h2>
            </div>
            <p>{summarizeMemberAccess(member)}</p>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>{member.role}</dd>
              </div>
              <div>
                <dt>Can manage invites</dt>
                <dd>{canManageInvitations(member, workspacePolicy) ? "yes" : "no"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{member.status}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </main>
  );
}
