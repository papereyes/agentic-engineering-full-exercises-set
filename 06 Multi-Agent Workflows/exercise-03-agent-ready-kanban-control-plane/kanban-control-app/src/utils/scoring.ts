import type { Incident, Severity } from "../data/incidents";

const severityOrder: Severity[] = ["Low", "Medium", "High", "Critical"];

export function calculateSeverity(incident: Incident): Severity {
  if (!incident.inheritedSeverity) return incident.declaredSeverity;

  return severityOrder.indexOf(incident.inheritedSeverity) > severityOrder.indexOf(incident.declaredSeverity)
    ? incident.inheritedSeverity
    : incident.declaredSeverity;
}
