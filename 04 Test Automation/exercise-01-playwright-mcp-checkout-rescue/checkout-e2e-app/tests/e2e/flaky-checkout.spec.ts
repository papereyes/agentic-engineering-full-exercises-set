import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, request }, testInfo) => {
  const session = `${testInfo.parallelIndex}-${randomUUID()}`;
  await page.setExtraHTTPHeaders({ "x-checkout-session": session });
  const reset = await request.post("/api/testing/reset", {
    headers: { "x-checkout-session": session },
  });

  expect(await reset.json()).toEqual({ reset: true, session });
});

test("approves checkout with the tax and authorization contracts", async ({ page }) => {
  const taxRequestPromise = page.waitForRequest("**/api/tax-quote");
  await page.goto("/");

  const pay = page.getByRole("button", { name: /Pay/ });
  await expect(pay).toBeDisabled();
  expect((await taxRequestPromise).postDataJSON()).toEqual({ country: "IN", subtotal: 99 });
  await expect(pay).toHaveAccessibleName("Pay $106.92");

  const authorizationRequestPromise = page.waitForRequest("**/api/payments/authorize");
  await pay.click();
  expect((await authorizationRequestPromise).postDataJSON()).toEqual({
    cardholder: "Asha Kumar",
    cardNumber: "4242424242424242",
    total: 106.92,
  });
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
});

test("recovers from a decline and approves the retry", async ({ page }) => {
  await page.goto("/");
  const pay = page.getByRole("button", { name: /Pay/ });
  await expect(pay).toHaveAccessibleName("Pay $106.92");

  await page.getByLabel("Card number").fill("4000000000000000");
  const declineRequestPromise = page.waitForRequest("**/api/payments/authorize");
  await pay.click();
  expect((await declineRequestPromise).postDataJSON()).toEqual({
    cardholder: "Asha Kumar",
    cardNumber: "4000000000000000",
    total: 106.92,
  });
  await expect(page.getByRole("heading", { name: "Payment declined" })).toBeVisible();

  await page.getByRole("button", { name: "Try another payment" }).click();
  await page.getByLabel("Card number").fill("4242424242424242");
  const retryAuthorizationRequestPromise = page.waitForRequest("**/api/payments/authorize");
  await pay.click();
  expect((await retryAuthorizationRequestPromise).postDataJSON()).toEqual({
    cardholder: "Asha Kumar",
    cardNumber: "4242424242424242",
    total: 106.92,
  });
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
});

test("duplicate submits send one authorization request", async ({ page }) => {
  const authorizationRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/api/payments/authorize")) authorizationRequests.push(request.url());
  });

  await page.goto("/");
  const pay = page.getByRole("button", { name: /Pay/ });
  await expect(pay).toHaveAccessibleName("Pay $106.92");
  await pay.evaluate((button) => {
    const form = button.closest("form");
    form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });

  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  expect(authorizationRequests).toHaveLength(1);
});
