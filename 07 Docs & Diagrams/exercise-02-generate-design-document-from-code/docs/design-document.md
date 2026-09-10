# Notification Routing Design

## Purpose and scope

The notification routing module chooses exactly one immediate delivery channel or one durable queue route. Its policy is push first, then consented SMS, then email, then durable fallback. The module decides *where* work should go; it does not send notifications, persist queue records, or manage provider health. The executable policy lives in [`selectNotificationRoute`](../notification-mesh-app/src/notification/routeNotification.mjs), and its six observable cases are protected by the [routing tests](../notification-mesh-app/scripts/run-routing-tests.mjs).

## Architecture

[`notification-dependencies.mmd`](../diagrams/notification-dependencies.mmd) shows the four implemented component dependencies. `ChannelRouter` reads provider status from `ProviderStatus`, reads SMS permission from `ConsentPolicy`, and creates either an `ImmediateRoute` or `DurableQueue` result. The generated [code graph](../artifacts/code-graph.json) records the underlying direct calls at an immutable source SHA; [`traceability.json`](../evidence/traceability.json) maps DEP-01 through DEP-06 from those calls to both diagrams.

The surrounding React application is an exercise interface, not part of notification delivery. It renders the challenge workflow and evidence UI, while the `.mjs` files under [`src/notification`](../notification-mesh-app/src/notification) form the small routing domain.

## Component responsibilities

- **Channel router:** [`routeNotification.mjs`](../notification-mesh-app/src/notification/routeNotification.mjs) owns channel priority, SMS consent gating, and the final durable fallback. Keeping these decisions together prevents providers from silently changing product policy.
- **Provider status:** [`channelProviders.mjs`](../notification-mesh-app/src/notification/channelProviders.mjs) performs strict boolean availability checks for push, SMS, and email. It reports facts but does not choose a route.
- **Consent policy:** [`consentPolicy.mjs`](../notification-mesh-app/src/notification/consentPolicy.mjs) treats only `smsConsent === true` as permission. It is consulted only for the SMS branch.
- **Route results:** [`routeResults.mjs`](../notification-mesh-app/src/notification/routeResults.mjs) creates the stable output shapes `{ channel, durable: false }` for immediate delivery and `{ channel: "queue", durable: true }` for deferred work.
- **Verification tooling:** the scripts in [`notification-mesh-app/scripts`](../notification-mesh-app/scripts) build and query the graph, parse Mermaid, exercise routing, and verify diagram semantics and evidence hashes.

## Dependencies and data flow

The caller passes one plain input containing `pushAvailable`, `smsAvailable`, `smsConsent`, and `emailAvailable`. The router evaluates branches in this order:

1. If [`pushAvailable(input)`](../notification-mesh-app/src/notification/channelProviders.mjs) is true, return `immediateRoute("push")`.
2. Otherwise, if `smsAvailable(input)` and [`hasSmsConsent(input)`](../notification-mesh-app/src/notification/consentPolicy.mjs) are both true, return `immediateRoute("sms")`.
3. Otherwise, if `emailAvailable(input)` is true, return `immediateRoute("email")`.
4. Otherwise, return [`durableQueueRoute()`](../notification-mesh-app/src/notification/routeResults.mjs).

[`fallback-sequence.mmd`](../diagrams/fallback-sequence.mmd) traces two important paths: SMS is healthy but not consented and therefore falls through to email; then no permitted provider is available and the router returns durable work. Each invocation returns immediately, so it cannot select multiple channels.

## Decisions and constraints

- **Priority is policy:** push precedes SMS, SMS precedes email, and the queue is last. Reordering conditions changes customer-visible behavior.
- **Consent is fail-closed:** only explicit `true` permits SMS. Provider availability cannot override the consent check, as required by the [current routing contract](current-routing-contract.md).
- **Fallback is router-owned:** providers and result factories do not call one another. The [stale-claim review](../evidence/stale-claims.md) records why those historical edges were rejected.
- **Output is singular and synchronous:** the router returns one small value and performs no I/O. Actual delivery and queue persistence are outside this fixture.
- **Source is authoritative:** the graph proves direct calls, but branch order and conditions are verified from source and the [routing tests](../notification-mesh-app/scripts/run-routing-tests.mjs).

## Risks and operational behavior

Incorrect priority can route through a less preferred channel. A missing or weakened consent guard can send SMS without authorization. Treating non-boolean truthy values as availability or consent would broaden the accepted input contract; current helpers deliberately require `=== true`. If all checks fail, the durable result prevents silent notification loss, but this fixture does not prove that another service persists or drains that queue.

The generated graph is static and records calls rather than runtime frequency, latency, provider failures, or data ownership outside the module. The diagrams should therefore not be extended with transport, database, retry, or provider-to-policy edges unless corresponding implementation and tests are added first.

## Safe change boundaries

- Change channel priority or permission rules in `selectNotificationRoute`, then update focused routing cases and both diagrams.
- Change how availability or consent facts are interpreted only in their respective helper modules, with boundary tests for the new input contract.
- Change result shapes in `routeResults.mjs` only with all consumers and routing assertions updated together.
- Do not hand-edit `artifacts/code-graph.json`; regenerate it with the supplied builder and refresh traceability and manifest hashes.
- Preserve the protected contracts and verifier scripts. Unsupported behavior belongs in implementation and tests before it belongs in documentation.

## Verification guidance

From `notification-mesh-app`, run `npm run test:routing` for behavior, `npm run graph:build:check` for artifact freshness, `npm run diagrams:parse` for Mermaid syntax, and `npm run verify:submission` for graph semantics, exact source-line traceability, stale claims, hashes, and required files. The intended final gate is `npm run verify:exercise`, which also checks protected inputs, lint, types, build output, and repository cleanliness.

When changing the module, regenerate the graph at the new source commit, update DEP evidence from generated edge IDs rather than estimated lines, and rerun the full gate. Remaining uncertainty should be stated explicitly instead of adding unimplemented operational details to a diagram.
