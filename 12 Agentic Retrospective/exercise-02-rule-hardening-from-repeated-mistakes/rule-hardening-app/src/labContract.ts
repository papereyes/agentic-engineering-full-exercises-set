export interface LabContract {
  title: string; competency: string; domain: string; mission: string; outcome: string;
  entities: string[]; seededDefects: string[]; verificationGates: string[];
  agentWorkflow: string[]; workingDeliverables: string[]; masterySignals: string[];
}

export const labContract: LabContract = {
  title: "Repeated Mistake to Repository Rule",
  competency: "12. Agentic Retrospective - Session review, waste reduction, and improvement",
  domain: "Trace-backed repository guidance with behavioral patch comparison",
  mission: "Convert three recurring persistence mistakes into minimal routed guidance and test its effect on a fresh first attempt.",
  outcome: "Matched agent patches and focused Git history prove defect reduction or a valid ceiling no-regression result.",
  entities: ["correction event", "safe-start rule", "deep persistence guidance", "first-attempt patch"],
  seededDefects: ["proving task omits hidden persistence conventions", "starter stores display and noncanonical values", "business logic uses ambient time"],
  verificationGates: ["two-event support per rule", "minimal and nonduplicated guidance", "isolated patch grading", "ceiling-aware no-regression when the baseline is already correct", "matched fresh-agent conditions", "automatic command capture"],
  agentWorkflow: ["Capture the unguided first patch.", "Commit only routed repository guidance.", "Capture a fresh guided first patch under matched conditions.", "Commit the successful source patch before adding the participant test."],
  workingDeliverables: ["AGENTS and focused persistence guidance.", "Before and after raw patches and metadata.", "Final source and participant test.", "Rule map, comparison, and Git proof."],
  masterySignals: ["Promotes only repeated corrections.", "Keeps deep detail out of safe-start context.", "Tests both rule effectiveness and exceptions.", "Binds final implementation to the graded agent patch."],
};
