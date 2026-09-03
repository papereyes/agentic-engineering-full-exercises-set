package dev.agentic.exercise.workflow;

import com.fasterxml.jackson.annotation.JsonProperty;

public record WorkflowItem(
    String id,
    String customer,
    String status,
    int score,
    String owner,
    String note) {
  @JsonProperty
  public String decisionState() {
    return switch (status) {
      case "Blocked" -> "needs-evidence";
      case "In Review" -> "pending-review";
      case "Ready" -> "accepted";
      default -> throw new IllegalStateException("Unknown workflow status: " + status);
    };
  }
}
