import type { QueuePolicy, RoutingHint, Severity, SupportCase } from "../types";

const severityWeight: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 4,
  critical: 7
};

export function getRoutingHint(item: SupportCase, policy: QueuePolicy): RoutingHint {
  const restricted = item.tags.some((tag) => policy.restrictedTags.includes(tag));
  const stale = item.lastActivityHours >= policy.staleAfterHours;
  const revenueCritical = item.revenueRiskUsd >= policy.criticalRevenueFloor;
  const riskScore = severityWeight[item.severity] + (stale ? 2 : 0) + (revenueCritical ? 3 : 0);

  if (restricted || revenueCritical) {
    return {
      owner: item.ownerTeam,
      action: stale ? "Escalate with owner approval" : "Keep with named owner",
      riskScore
    };
  }

  if (item.segment === "self-serve" && item.severity === "low") {
    return {
      owner: "growth",
      action: "Route to lifecycle queue",
      riskScore
    };
  }

  return {
    owner: item.ownerTeam || policy.defaultOwner,
    action: stale ? "Refresh customer contact" : "Continue standard triage",
    riskScore
  };
}

export function needsAttention(item: SupportCase, policy: QueuePolicy) {
  return item.lastActivityHours >= policy.staleAfterHours || item.revenueRiskUsd >= policy.criticalRevenueFloor;
}

export function sortCasesForTriage(items: SupportCase[], policy: QueuePolicy) {
  return [...items].sort((first, second) => {
    const firstRisk = getRoutingHint(first, policy).riskScore;
    const secondRisk = getRoutingHint(second, policy).riskScore;
    return secondRisk - firstRisk;
  });
}

export function describePolicy(policy: QueuePolicy) {
  return `Escalate after ${policy.staleAfterHours} hours or when revenue risk reaches $${policy.criticalRevenueFloor.toLocaleString()}.`;
}
