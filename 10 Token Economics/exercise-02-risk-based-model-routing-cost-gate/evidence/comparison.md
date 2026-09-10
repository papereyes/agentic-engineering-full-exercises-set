# Routing comparison

## Same conditions

Before and After use the same starting commit, eight protected cases, 36 protected offline observations, three runs per eligible lane, fixed pricing, response hashes, quality floors, safety rubric, scorer version, and retry model. Both use the same Codex model, repository tools, permissions, 45-minute limit, zero human hints, and zero retries to the implementation itself.

## Before

The all-reasoning baseline sends every classified task to the costly tier. Its expected cost is USD 0.1001933333, it never clarifies incomplete inputs, and its characterization patch records that behavior.

## After

The field router selects two fast, two balanced, two reasoning, and two clarify outcomes. A single retry escalates failed low-cost observations. Selected routes have zero safety failures, all mean quality floors pass, expected cost is USD 0.048863, and savings are 51.2312861801%.

## Proof

The measurement ledger retains all 36 token, latency, quality, safety, and response-hash records. The generated cost model reconciles pricing and correlated retries. Protected fixture, router, history, and submission checks recompute every gate without a provider API key.

## Conclusion

Adopt the After policy. It preserves the benchmark’s quality and safety requirements while cutting expected cost by more than half and routing incomplete classifications to clarification instead of spending blindly.
