import assert from "node:assert/strict";
import fs from "node:fs";
import { createLegacyCheckout } from "../src/checkout/legacyCheckout.mjs";
import { routeCheckout } from "../src/checkout/checkoutRouter.mjs";

let createCardCheckout;
try {
  ({ createCardCheckout } = await import("../src/checkout/cardCheckout.mjs"));
} catch {
  throw new Error("Create src/checkout/cardCheckout.mjs and export createCardCheckout");
}

const cases = JSON.parse(fs.readFileSync(new URL("../../docs/checkout-cases.json", import.meta.url), "utf8"));
for (const scenario of cases) {
  const legacyCalls = [];
  const cardCalls = [];
  const legacy = createLegacyCheckout({ authorize: async (request) => { legacyCalls.push(request); return scenario.authorization; } });
  const card = createCardCheckout({ authorize: async (request) => { cardCalls.push(request); return scenario.authorization; } });
  const legacyResult = await legacy(structuredClone(scenario.request));
  const cardResult = await card(structuredClone(scenario.request));
  assert.deepEqual(legacyResult, scenario.expected, `${scenario.name}: legacy fixture changed`);
  assert.deepEqual(cardResult, legacyResult, `${scenario.name}: card slice changed the public result`);
  assert.equal(legacyCalls.length, 1);
  assert.equal(cardCalls.length, 1);
  assert.deepEqual(cardCalls[0], {
    orderId: scenario.request.orderId,
    amountCents: scenario.expected.totalCents,
    paymentToken: scenario.request.paymentToken,
  });
}

function resultFor(request, status = "paid", errorCode = null) {
  return {
    orderId: request.orderId,
    status,
    totalCents: request.subtotalCents + Math.round(request.subtotalCents * request.taxRateBps / 10000),
    errorCode,
  };
}

function routingFakes(cardBehavior = async (request) => resultFor(request)) {
  const calls = { legacy: [], card: [] };
  return {
    calls,
    dependencies: {
      legacy: async (request) => { calls.legacy.push(structuredClone(request)); return resultFor(request); },
      card: async (request) => { calls.card.push(structuredClone(request)); return cardBehavior(request); },
      cardSliceEnabled: true,
    },
  };
}
const request = { orderId: "ord-route", paymentType: "card", subtotalCents: 1001, taxRateBps: 825, paymentToken: "tok" };
const expectedPaid = resultFor(request);

const enabled = routingFakes();
assert.deepEqual(await routeCheckout(structuredClone(request), enabled.dependencies), expectedPaid);
assert.deepEqual(enabled.calls, { legacy: [], card: [request] });

for (const paymentType of ["gift-card", "invoice", "crypto"]) {
  const current = routingFakes();
  const routedRequest = { ...request, paymentType };
  assert.deepEqual(await routeCheckout(structuredClone(routedRequest), current.dependencies), resultFor(routedRequest));
  assert.deepEqual(current.calls, { legacy: [routedRequest], card: [] }, `${paymentType} must remain legacy with the complete request`);
}

const disabled = routingFakes();
disabled.dependencies.cardSliceEnabled = false;
assert.deepEqual(await routeCheckout(structuredClone(request), disabled.dependencies), expectedPaid);
assert.deepEqual(disabled.calls, { legacy: [request], card: [] }, "flag-off card must use legacy only with the complete request");

const safe = routingFakes(async () => { throw { authorizationCreated: false }; });
assert.deepEqual(await routeCheckout(structuredClone(request), safe.dependencies), expectedPaid);
assert.deepEqual(safe.calls, { legacy: [request], card: [request] }, "pre-authorization failure must fall back exactly once");

const uncertainResult = resultFor(request, "failed", "PAYMENT_STATE_UNKNOWN");
for (const { failure, expected } of [
  { failure: { authorizationCreated: true, result: uncertainResult }, expected: uncertainResult },
  { failure: { result: uncertainResult }, expected: uncertainResult },
  { failure: { authorizationCreated: true, result: { status: "failed" } }, expected: uncertainResult },
  { failure: new Error("gateway outcome unknown"), expected: uncertainResult },
  { failure: "gateway outcome unknown", expected: uncertainResult },
]) {
  const unsafe = routingFakes(async () => { throw failure; });
  const result = await routeCheckout(structuredClone(request), unsafe.dependencies);
  assert.deepEqual(unsafe.calls, { legacy: [], card: [request] }, "unsafe failure must never retry legacy and must receive the complete request");
  assert.deepEqual(result, expected, "unsafe failure must return a complete public result");
}

console.log("PASS 2 legacy comparisons and 11 protected strangler route checks");
