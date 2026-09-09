import type { WorkItem } from "../types";
import { createEvidenceBundle, serializeEvidenceBundle } from "../services/workflowApi";

interface EvidencePanelProps {
  item: WorkItem;
  evidence: string[];
  onCollect: () => Promise<void>;
}

export function EvidencePanel({ item, evidence, onCollect }: EvidencePanelProps) {
  function exportEvidence() {
    const json = serializeEvidenceBundle(createEvidenceBundle(item, evidence, new Date().toISOString()));
    const download = document.createElement("a");
    download.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    download.download = `${item.id}-evidence.json`;
    download.click();
    URL.revokeObjectURL(download.href);
  }

  return (
    <section className="evidence-panel" aria-label="Evidence panel">
      <div className="section-title">
        <h2>Evidence</h2>
        <button type="button" onClick={onCollect}>
          Collect
        </button>
        {evidence.length > 0 ? (
          <button type="button" onClick={exportEvidence}>
            Export JSON
          </button>
        ) : null}
      </div>
      {evidence.length === 0 ? (
        <p className="muted">No evidence collected for {item.name} yet.</p>
      ) : (
        <ul>
          {evidence.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
