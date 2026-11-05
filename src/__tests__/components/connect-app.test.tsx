import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ConnectApp from "~/app/(dashboard)/environment/[environment_id]/infobox/connect-app";

jest.mock("sonner", () => ({ toast: Object.assign(jest.fn(), { error: jest.fn() }) }));

describe("Connect your app", () => {
  it("offers every supported SDK and copies the selected environment example", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<ConnectApp projectId="project-123" agentId="agent-456" environmentId="environment-789" />);

    const methods = ["React", "Next.js", "Go", "Rust", "Python", "PHP", "C#", "Swift", "Kotlin", "Ruby", "Elixir", "REST API"];
    expect(screen.getAllByRole("tab")).toHaveLength(methods.length);

    for (const method of methods) {
      const tab = screen.getByRole("tab", { name: method });
      fireEvent.mouseDown(tab, { button: 0, ctrlKey: false });
      expect(tab).toHaveAttribute("aria-selected", "true");
      const panel = screen.getByRole("tabpanel");
      expect(panel).toHaveTextContent("project-123");
      expect(panel).toHaveTextContent("agent-456");
      expect(panel).toHaveTextContent("environment-789");

      fireEvent.click(screen.getByRole("button", { name: `Copy ${method} example` }));
      await waitFor(() => expect(writeText).toHaveBeenCalledTimes(methods.indexOf(method) + 1));
      const examples = panel.querySelectorAll("pre code");
      expect(writeText).toHaveBeenLastCalledWith(examples[examples.length - 1]?.textContent);
    }

    expect(writeText).toHaveBeenLastCalledWith(expect.stringContaining('curl "https://api.flags.gg/flags"'));
  });

  it("replaces the project placeholder when project details arrive", () => {
    const { rerender } = render(<ConnectApp agentId="agent-456" environmentId="environment-789" />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("YOUR_PROJECT_ID");

    rerender(<ConnectApp projectId="project-123" agentId="agent-456" environmentId="environment-789" />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("project-123");
    expect(screen.queryByText(/Project details are loading/)).not.toBeInTheDocument();
  });
});
