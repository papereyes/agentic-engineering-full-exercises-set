import { workflows } from "./data/workflows";
import { classifyWorkflow, summarizeGuardrailGap } from "./services/approvalEngine";

export default function App() {
  const classifications = workflows.map(classifyWorkflow);
  const editableCount = classifications.filter(({ agentEditable }) => agentEditable).length;
  const approvalCount = classifications.filter(({ requiresApproval }) => requiresApproval).length;

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Release operations</p>
        <h1>Agent safety dashboard</h1>
        <p>{summarizeGuardrailGap(workflows)}</p>
        <h2>Release Readiness Summary</h2>
        <p>Editable by agent: {editableCount}</p>
        <p>Require human approval: {approvalCount}</p>
      </section>

      <section className="workflow-list">
        {workflows.map((workflow) => {
          const classification = classifyWorkflow(workflow);
          return (
            <article className="workflow-card" key={workflow.id}>
              <div>
                <p className="eyebrow">{workflow.id}</p>
                <h2>{workflow.name}</h2>
              </div>
              <p>{workflow.description}</p>
              <dl>
                <div>
                  <dt>Risk</dt>
                  <dd>{classification.risk}</dd>
                </div>
                <div>
                  <dt>Approval</dt>
                  <dd>{classification.requiresApproval ? "required" : "not required"}</dd>
                </div>
                <div>
                  <dt>Editable by agent</dt>
                  <dd>{classification.agentEditable ? "yes" : "no"}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </section>
    </main>
  );
}
