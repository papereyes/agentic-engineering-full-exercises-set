# Stale Graph Claim Review

## STALE-01 — `selectNotificationRoute -> pushAvailable`

Result: supported. Graph edge `calls:b4ecdcb068fb` records the direct call at `src/notification/routeNotification.mjs:6`. The router checks push first, so both final diagrams retain this relationship under `ChannelRouter -> ProviderStatus`.

## STALE-02 — `selectNotificationRoute -> smsAvailable`

Result: supported. Graph edge `calls:f625212c18d7` records the direct call at `src/notification/routeNotification.mjs:7`. The sequence keeps this provider check but follows it with the consent decision required on the same source line.

## STALE-03 — `selectNotificationRoute -> immediateRoute` for every available provider

Result: rejected. Graph edge `calls:8aa0cc10c4a0` confirms direct immediate-route calls at lines 6, 7, and 8, but source line 7 proves that SMS availability alone is insufficient: `hasSmsConsent(input)` must also pass. The final diagrams show selection only after all channel conditions pass.

## STALE-04 — `smsAvailable -> hasSmsConsent`

Result: rejected. Source: `src/notification/routeNotification.mjs:7` calls both functions from `selectNotificationRoute`; the generated graph contains no call from `smsAvailable` to `hasSmsConsent`. Consent is router-owned, so the final dependency starts at `ChannelRouter`.

## STALE-05 — `emailAvailable -> hasSmsConsent`

Result: rejected. Source: `src/notification/routeNotification.mjs:7-8` checks SMS consent before independently checking email availability. The graph contains no email-provider-to-consent edge, and the final diagrams do not invent one.

## STALE-06 — `immediateRoute -> durableQueueRoute` after provider failure

Result: rejected. Graph edge `calls:f5fd28b7fb8e` records `selectNotificationRoute` calling `durableQueueRoute` directly at line 9. `immediateRoute` never owns failure fallback, so the final dependency and sequence route the queue decision from `ChannelRouter`.
