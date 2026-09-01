import { useMemo, useState } from "react";
import { sampleCases, queuePolicy } from "./data/cases";
import { describePolicy, getRoutingHint, needsAttention, sortCasesForTriage } from "./services/caseRouter";
import type { CaseStatus } from "./types";

const statuses: Array<CaseStatus | "all" | "needs-attention"> = [
  "all",
  "needs-attention",
  "new",
  "triaged",
  "waiting",
  "blocked"
];

export default function App() {
  const [status, setStatus] = useState<CaseStatus | "all" | "needs-attention">("all");
  const visibleCases = useMemo(() => {
    const filtered =
      status === "all"
        ? sampleCases
        : status === "needs-attention"
          ? sampleCases.filter((item) => needsAttention(item, queuePolicy))
          : sampleCases.filter((item) => item.status === status);
    return sortCasesForTriage(filtered, queuePolicy).map((item) => ({
      item,
      hint: getRoutingHint(item, queuePolicy)
    }));
  }, [status]);

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Support operations</p>
          <h1>Case routing console</h1>
          <p>{describePolicy(queuePolicy)}</p>
        </div>
        <div className="score">
          <span>{visibleCases.length}</span>
          <small>visible cases</small>
        </div>
      </section>

      <section className="toolbar" aria-label="Case status filters">
        {statuses.map((option) => (
          <button
            className={option === status ? "active" : ""}
            key={option}
            onClick={() => setStatus(option)}
            type="button"
          >
            {option === "needs-attention" ? "Needs Attention" : option}
          </button>
        ))}
      </section>

      <section className="case-grid">
        {visibleCases.map(({ item, hint }) => (
          <article className="case-card" key={item.id}>
            <div>
              <p className="case-id">{item.id}</p>
              <h2>{item.customer}</h2>
            </div>
            <dl>
              <div>
                <dt>Severity</dt>
                <dd>{item.severity}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{hint.owner}</dd>
              </div>
              <div>
                <dt>Action</dt>
                <dd>{hint.action}</dd>
              </div>
            </dl>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
