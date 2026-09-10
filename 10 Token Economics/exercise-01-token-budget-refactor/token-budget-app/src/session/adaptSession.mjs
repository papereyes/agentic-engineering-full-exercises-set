export class SessionAdapterError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "SessionAdapterError";
    this.code = code;
  }
}

function isValidIsoTimestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const parsed = Date.parse(value);
  const canonical = value.includes(".") ? value : value.replace("Z", ".000Z");
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === canonical;
}

function validateUserId(input) {
  if (!input || typeof input.userId !== "string" || input.userId.trim() === "") {
    throw new SessionAdapterError("SESSION_USER_REQUIRED", "Session userId is required");
  }
}

function validateExpiresAt(expiresAt) {
  if (!isValidIsoTimestamp(expiresAt)) {
    throw new SessionAdapterError("SESSION_EXPIRY_INVALID", "Session expiresAt must be an ISO timestamp");
  }
}

function normalizeRoles(roles) {
  if (!Array.isArray(roles)) {
    throw new SessionAdapterError("SESSION_ROLES_INVALID", "Session roles must be an array of non-empty strings");
  }

  const normalized = [];
  const seen = new Set();
  for (const role of roles) {
    if (typeof role !== "string" || role.trim() === "") {
      throw new SessionAdapterError("SESSION_ROLES_INVALID", "Session roles must be an array of non-empty strings");
    }
    if (!seen.has(role)) {
      seen.add(role);
      normalized.push(role);
    }
  }
  return normalized;
}

export function adaptSession(input) {
  validateUserId(input);
  validateExpiresAt(input.expiresAt);
  const roles = normalizeRoles(input.roles);
  return { userId: input.userId, roles, expiresAt: input.expiresAt };
}
