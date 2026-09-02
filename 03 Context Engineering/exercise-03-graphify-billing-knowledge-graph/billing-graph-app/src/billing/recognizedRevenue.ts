import type { BillingEvent, TenantAccountLink } from "./billingTypes";
import { resolveBillingAccountId } from "./tenantAccountDirectory";

export function recognizedRevenueByAccount(events: BillingEvent[], links: TenantAccountLink[]) {
  return events.reduce<Record<string, number>>((totals, event) => {
    const accountId = resolveBillingAccountId(event.tenantId, links);
    const amount = event.kind === "charge" ? event.grossAmount - event.credits : -event.grossAmount;
    totals[accountId] = (totals[accountId] ?? 0) + amount;
    return totals;
  }, {});
}
