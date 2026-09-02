export interface BillingCustomer {
  id: string;
  ownerUserId: string;
}

export interface Workspace {
  id: string;
  billingCustomerId: string;
  plan: "Starter" | "Growth" | "Enterprise";
  dataResidency: "standard" | "restricted";
}

export interface WorkspaceMembership {
  workspaceId: string;
  userId: string;
  role: "member" | "admin";
  status: "active" | "suspended";
}

export interface ExportAuthorizationContext {
  callerUserId: string;
  billingCustomer: BillingCustomer;
  workspace: Workspace;
  membership: WorkspaceMembership | null;
}

export function canExportAIHistory(context: ExportAuthorizationContext) {
  return (
    context.workspace.plan === "Enterprise" &&
    context.workspace.dataResidency === "standard" &&
    context.membership?.userId === context.callerUserId &&
    context.membership.workspaceId === context.workspace.id &&
    context.membership.status === "active" &&
    context.membership.role === "admin"
  );
}
