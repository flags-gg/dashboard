import { render, screen } from "@testing-library/react";

// Mock shadcn/ui card components
jest.mock("~/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { InfoBoxError } from "~/components/InfoBoxError";

describe("InfoBoxError", () => {
  it("renders the component name in the title", async () => {
    const element = await InfoBoxError({ name: "Agent", blurb: "timeout" });
    render(element);

    expect(screen.getByText("Error Loading Agent")).toBeTruthy();
  });

  it("renders the error blurb", async () => {
    const element = await InfoBoxError({ name: "Project", blurb: "Not found" });
    render(element);

    expect(screen.getByText("Error: Not found")).toBeTruthy();
  });

  it("shows support message", async () => {
    const element = await InfoBoxError({ name: "Test", blurb: "error" });
    render(element);

    expect(
      screen.getByText("If this error persists, please contact support.")
    ).toBeTruthy();
  });
});
