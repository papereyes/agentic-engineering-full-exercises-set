# Avoided work

Checkout remains on `legacy-primary`, while destructive delete behavior remains on `legacy-danger`; neither consumer needed an edit. Unknown legacy actions also preserve their fallback. The reason is that the shared helper already exposes the exact decision point required for a one-branch export migration.

No shared React components were reorganized, no styles were added, and no design-system package was installed. Those changes would turn a behavior correction into an unrelated cleanup and raise review and regression cost. `actionButtons.mjs` was inspected as a protected real-consumer surface but intentionally left unchanged.

The focused test calls the helper and all real action factories, providing evidence that the narrow change reaches export without altering checkout, destructive, or unknown behavior. This is avoided work by design: the scope plan excludes every tempting shared path because none is necessary to meet the production contract.
