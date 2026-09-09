import type { AccessReview } from "../data/accessReviews";

export interface ApprovalActor {
  id: string;
  canApprovePrivileged: boolean;
}

export class ApprovalError extends Error {
  constructor(public readonly code: "NOT_AUTHORIZED" | "MISSING_EVIDENCE") {
    super(code === "NOT_AUTHORIZED" ? "Actor cannot approve privileged access" : "Privileged access requires complete evidence");
    this.name = "ApprovalError";
  }
}

interface ApprovalDependencies {
  wait?: (milliseconds: number) => Promise<unknown>;
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function approveAccessReview(
  review: AccessReview,
  actor: ApprovalActor,
  dependencies: ApprovalDependencies = {},
): Promise<AccessReview> {
  if (review.privileged && !actor.canApprovePrivileged) throw new ApprovalError("NOT_AUTHORIZED");
  if (review.privileged && !review.evidenceComplete) throw new ApprovalError("MISSING_EVIDENCE");
  await (dependencies.wait ?? wait)(120);
  return { ...review, status: "approved" };
}
