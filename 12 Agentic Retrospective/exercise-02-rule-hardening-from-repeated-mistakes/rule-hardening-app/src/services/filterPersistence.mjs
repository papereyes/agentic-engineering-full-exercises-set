/**
 * Builds a persistable snapshot of the current owner/status filter selection.
 *
 * Fixes two repeated mistakes in this codebase:
 *  - Persisting display labels (e.g. `filter.owner.label`, `filter.statusLabel`)
 *    instead of the underlying stable values. Labels can change or be
 *    re-worded between sessions, which breaks restoring the selection later.
 *    We persist the stable value/id instead, falling back gracefully if a
 *    stable field isn't available.
 *  - Reading the ambient clock (`new Date()`) instead of using the injected
 *    `clock`, which makes the timestamp non-deterministic and hard to test.
 */
function resolveTimestamp(clock) {
  let now;
  if (typeof clock === "function") {
    now = clock();
  } else if (clock && typeof clock.now === "function") {
    now = clock.now();
  } else if (clock instanceof Date || typeof clock === "number" || typeof clock === "string") {
    now = clock;
  } else {
    now = new Date();
  }
  return (now instanceof Date ? now : new Date(now)).toISOString();
}

export function buildSavedFilter(filter, clock) {
  const owner = filter.owner && typeof filter.owner === "object"
    ? filter.owner.value ?? filter.owner.id ?? filter.owner.label
    : filter.owner;
  const status = filter.status ?? filter.statusValue ?? filter.statusLabel;

  return {
    owner,
    status,
    updatedAt: resolveTimestamp(clock),
  };
}
