# Before

Base SHA: `e83928ed3c4d34fd51039c65b3d86373687cb259`.

Initial checks showed an invalid control plane: ESC-118 was needs-info but reserved `workflowApi.ts`; ESC-122 was blocked yet collided with ESC-120 on `scoring.ts`; ESC-121 was cancelled but retained `exportApi.ts`. ESC-120 was the only ready-for-agent card and correctly reserved its three lane prefixes.

The initial ownership collision count was one shared scoring path, with three additional unsafe reservations. The protected feature check failed because inherited Critical severity was ignored. No unsafe card was assigned.
