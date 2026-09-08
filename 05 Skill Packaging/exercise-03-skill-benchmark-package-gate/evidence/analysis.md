# Benchmark Analysis

## Training failures

No-skill and starter training runs initially passed 0/5 assertions for both tasks. They omitted bracketed source attribution, used non-contract headings, repeated a superseded recovery claim near an early mitigation time, and did not reliably preserve uncertainty or open follow-up state. The candidate added only generic rules for exact sections, source citations, fact/inference separation, recovery boundaries, conflicting-source preservation, impact units, and follow-up state.

## Held-out and gate

The final candidate achieved 100% held-out quality and 100% critical accuracy versus 16.7%/16.7% for no skill and 0%/0% for the starter. Held-out pass-rate variance fell to 0 from the no-skill outlier-driven 0.373. Candidate mean tokens were 34,738, or 0.941× no skill; mean elapsed time was 27.6 seconds, or 1.041× no skill. Both cost limits passed.

The notable outlier was no-skill eval 3 run 3, which happened to pass all assertions while its other five held-out baseline runs passed none. That assertion set remained discriminating across repeated runs because the baseline variance exposed the instability; all final runs were consistent.

## Adoption

Adopt and package the candidate. It passed every common check, improved held-out quality by 83.3 percentage points over no skill and 100 points over the starter, eliminated critical failures and variance, and stayed inside token and elapsed limits.
