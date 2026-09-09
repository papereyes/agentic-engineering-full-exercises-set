import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SeverityBadge } from "../../src/components/SeverityBadge";

describe("ESC-120 inherited severity", () => {
  it("shows the higher severity inherited from a parent incident", () => {
    const markup = renderToStaticMarkup(
      <SeverityBadge
        incident={{
          id: "child",
          summary: "Child incident",
          declaredSeverity: "Low",
          inheritedSeverity: "Critical",
        }}
      />,
    );

    expect(markup).toContain('data-severity="Critical"');
    expect(markup).toContain(">Critical<");
  });
});
