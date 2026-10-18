import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { AgentSwitch } from "~/app/(dashboard)/agent/[agent_id]/infobox/switch";
import { EnvironmentSwitch } from "~/app/(dashboard)/environment/[environment_id]/infobox/switch";
import { ProjectSwitch } from "~/app/(dashboard)/project/[project_id]/infobox/switch";

jest.mock("sonner", () => ({ toast: jest.fn() }));
// stable references, like react-query's cached data
jest.mock("~/hooks/use-agent", () => ({
  useAgent: (() => { const r = { data: { agent_id: "agent-b", name: "backend", enabled: true }, isLoading: false }; return () => r; })(),
}));
jest.mock("~/hooks/use-environment", () => ({
  useEnvironment: (() => { const r = { data: { environment_id: "env-b", name: "live", enabled: false }, isLoading: false }; return () => r; })(),
}));
jest.mock("~/hooks/use-project", () => ({
  useProject: (() => { const r = { data: { project_id: "proj-b", name: "repro", enabled: true }, isLoading: false }; return () => r; })(),
}));

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true });
  global.fetch = fetchMock;
  jest.mocked(toast).mockReset();
  // stale atoms from another tab must be ignored
  localStorage.setItem("agentAtom", JSON.stringify({ agent_id: "agent-a", name: "frontend", enabled: false }));
  localStorage.setItem("environmentAtom", JSON.stringify({ environment_id: "env-a", name: "dev", enabled: true }));
  localStorage.setItem("projectAtom", JSON.stringify({ project_id: "proj-a", name: "other", enabled: false }));
});

const renderWithClient = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>);

const toggleAndGetBody = async () => {
  fireEvent.click(screen.getByRole("switch"));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  return JSON.parse(fetchMock.mock.calls[0][1].body as string) as Record<string, unknown>;
};

describe("enable/disable switches use their own id and fetched state", () => {
  it("agent", async () => {
    renderWithClient(<AgentSwitch agent_id={"agent-b"} />);
    expect(await toggleAndGetBody()).toEqual({ agentId: "agent-b", name: "backend", enabled: false });
  });

  it("environment", async () => {
    renderWithClient(<EnvironmentSwitch environmentId={"env-b"} />);
    expect(await toggleAndGetBody()).toEqual({ environmentId: "env-b", name: "live", enabled: true });
  });

  it("project", async () => {
    renderWithClient(<ProjectSwitch projectId={"proj-b"} />);
    expect(await toggleAndGetBody()).toEqual({ projectId: "proj-b", name: "repro", enabled: false });
  });

  it("reports a failed update as an error", async () => {
    fetchMock.mockResolvedValue({ ok: false });
    renderWithClient(<AgentSwitch agent_id={"agent-b"} />);
    fireEvent.click(screen.getByRole("switch"));
    await waitFor(() => expect(toast).toHaveBeenCalledWith("Error updating agent", expect.anything()));
  });
});
