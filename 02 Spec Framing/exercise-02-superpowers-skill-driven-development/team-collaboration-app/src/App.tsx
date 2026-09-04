import { useState, type FormEvent } from "react";
import { members, workspacePolicy } from "./data/team";
import { acceptInvitation, createInvitation, revokeInvitation } from "./services/invitationService";
import { canManageInvitations, summarizeMemberAccess } from "./services/teamPolicy";
import type { InvitationRole, InvitationState } from "./types";

export default function App() {
  const [team, setTeam] = useState<InvitationState>({ members, invitations: [], policy: workspacePolicy });
  const [actorId, setActorId] = useState(members.find((member) => member.status === "active" && (member.role === "owner" || member.role === "admin"))?.id ?? "");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitationRole>("member");
  const [feedback, setFeedback] = useState("");
  const actors = team.members.filter((member) => member.status === "active" && (member.role === "owner" || member.role === "admin"));

  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = createInvitation(team, { actorId, email, role, invitationId: `INV-${team.invitations.length + 1}-${Date.now()}`, now: new Date().toISOString() });
    if (result.ok) {
      setTeam(result.state);
      setEmail("");
      setFeedback("Invitation created.");
    } else setFeedback(result.code ?? "UNKNOWN_ERROR");
  }

  function accept(invitationId: string) {
    const result = acceptInvitation(team, { invitationId, memberId: `USR-${team.members.length + 1}-${Date.now()}`, now: new Date().toISOString() });
    if (result.ok) {
      setTeam(result.state);
      setFeedback("Invitation accepted.");
    } else setFeedback(result.code ?? "UNKNOWN_ERROR");
  }

  function revoke(invitationId: string) {
    const result = revokeInvitation(team, { invitationId, actorId, now: new Date().toISOString() });
    if (result.ok) {
      setTeam(result.state);
      setFeedback("Invitation revoked.");
    } else setFeedback(result.code ?? "UNKNOWN_ERROR");
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Workspace admin</p>
        <h1>Team collaboration console</h1>
        <p>Members and roles exist. Invitation behavior is the unclear feature request for this exercise.</p>
      </section>

      <section className="invitations" aria-labelledby="team-invitations-title">
        <h2 id="team-invitations-title">Team Invitations</h2>
        <form className="invitation-form" onSubmit={create}>
          <label>
            Actor
            <select value={actorId} onChange={(event) => setActorId(event.target.value)}>
              {actors.map((member) => <option key={member.id} value={member.id}>{member.name} ({member.role})</option>)}
            </select>
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Role
            <select value={role} onChange={(event) => setRole(event.target.value as InvitationRole)}>
              <option value="member">Member</option>
              <option value="guest" disabled={!team.policy.allowGuestInvites}>Guest</option>
            </select>
          </label>
          <button type="submit">Create invitation</button>
        </form>
        <p className="invitation-feedback" aria-live="polite">{feedback}</p>
        <ul className="invitation-list">
          {team.invitations.map((invitation) => (
            <li key={invitation.id}>
              <div>
                <strong>{invitation.email}</strong>
                <span>{invitation.role} · {invitation.status} · Expires {new Date(invitation.expiresAt).toLocaleString()}</span>
              </div>
              {invitation.status === "pending" && (
                <div className="button-row">
                  <button type="button" onClick={() => accept(invitation.id)}>Accept</button>
                  <button type="button" onClick={() => revoke(invitation.id)}>Revoke</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="member-grid">
        {team.members.map((member) => (
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
                <dd>{canManageInvitations(member, team.policy) ? "yes" : "no"}</dd>
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
