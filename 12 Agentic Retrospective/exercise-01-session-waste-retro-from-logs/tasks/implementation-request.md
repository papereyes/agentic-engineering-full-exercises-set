# Session Waste Implementation Request

Correct the session analyzer so it distinguishes preventable repetition from useful engineering work. Implement an executable preflight policy that blocks an unchanged failed command from being retried until the session records a diagnosis or the workspace revision changes. Add focused tests and keep the change limited to the analyzer, preflight policy, and participant test.
