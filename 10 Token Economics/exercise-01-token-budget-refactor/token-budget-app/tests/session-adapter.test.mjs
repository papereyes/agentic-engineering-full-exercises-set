import assert from "node:assert/strict";
import { adaptSession, SessionAdapterError } from "../src/session/adaptSession.mjs";

const expiresAt = "2026-08-14T10:30:00Z";
const adapted = adaptSession({ userId: "user-20", roles: ["admin", "reader", "admin"], expiresAt, ignored: true });
assert.deepEqual(adapted, { userId: "user-20", roles: ["admin", "reader"], expiresAt }, "duplicate roles keep their first occurrence and unknown fields are ignored");
assert.deepEqual(adaptSession({ userId: "user-20", roles: [], expiresAt }).roles, [], "empty roles remain valid");

function expectError(input, code, message) {
  let synchronous = false;
  assert.throws(
    () => {
      adaptSession(input);
      synchronous = true;
    },
    (error) => error instanceof SessionAdapterError && error.code === code && error.message === message,
  );
  assert.equal(synchronous, false, `${code} throws synchronously before returning`);
}

expectError(
  { roles: ["admin"], expiresAt: "invalid" },
  "SESSION_USER_REQUIRED",
  "Session userId is required",
);
expectError(
  { userId: "user-20", roles: "admin", expiresAt: "invalid" },
  "SESSION_EXPIRY_INVALID",
  "Session expiresAt must be an ISO timestamp",
);
expectError(
  { userId: "user-20", roles: ["admin", ""], expiresAt },
  "SESSION_ROLES_INVALID",
  "Session roles must be an array of non-empty strings",
);

const sparseRoles = new Array(1);

expectError(
  { userId: "user-20", roles: sparseRoles, expiresAt },
  "SESSION_ROLES_INVALID",
  "Session roles must be an array of non-empty strings",
);

console.log("PASS adapter output, duplicate normalization, validation order, synchronous errors, and sparse roles");
