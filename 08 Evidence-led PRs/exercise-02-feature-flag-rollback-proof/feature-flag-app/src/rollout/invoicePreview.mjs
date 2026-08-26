/** Flag boundary: disabled/errored/invalid paths must never call the API or emit telemetry. */
function hasValidContext(context) {
  const targetingKey = context?.targetingKey;
  const accountId = context?.accountId;
  return (
    typeof targetingKey === "string" &&
    targetingKey.length > 0 &&
    typeof accountId === "string" &&
    accountId.length > 0 &&
    targetingKey === accountId
  );
}

export async function loadInvoiceExperience({ flagClient, context, api, telemetry }) {
  if (!hasValidContext(context)) {
    return { experience: "legacy", reason: "invalid-context" };
  }

  let enabled;
  try {
    enabled = await flagClient.getBooleanValue("invoice-preview-v2", false, context);
  } catch {
    return { experience: "legacy", reason: "flag-evaluation-error" };
  }

  if (!enabled) {
    return { experience: "legacy", reason: "flag-disabled" };
  }

  try {
    const preview = await api.loadPreview(context.accountId);
    telemetry.emit("invoice_preview_viewed", {
      targetingKey: context.targetingKey,
      accountId: context.accountId,
      flagKey: "invoice-preview-v2",
    });
    return { experience: "preview", preview };
  } catch {
    return { experience: "legacy", reason: "preview-unavailable" };
  }
}
