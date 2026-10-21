import { render, screen } from "@testing-library/react";
import BreadCrumbs from "~/components/HeaderBar/breadcrumbs";

const path = { current: "/" };
jest.mock("next/navigation", () => ({ usePathname: () => path.current }));

const environments: Record<string, unknown> = {
  "env-fe": { environment_id: "env-fe", name: "live", agent_id: "agent-fe" },
  "env-be": { environment_id: "env-be", name: "live", agent_id: "agent-be" },
};
const agents: Record<string, unknown> = {
  "agent-fe": { agent_id: "agent-fe", name: "frontend", project_info: { project_id: "proj-1", name: "repro" } },
  "agent-be": { agent_id: "agent-be", name: "backend", project_info: { project_id: "proj-1", name: "repro" } },
};
jest.mock("~/hooks/use-environment", () => ({ useEnvironment: (id: string) => ({ data: environments[id] }) }));
jest.mock("~/hooks/use-agent", () => ({ useAgent: (id: string) => ({ data: agents[id] }) }));
jest.mock("~/hooks/use-project", () => ({
  useProject: (id: string) => ({ data: id ? { project_id: id, name: "repro" } : undefined }),
}));

beforeEach(() => {
  // what the atoms held after visiting frontend's env first
  localStorage.setItem("agentAtom", JSON.stringify({ agent_id: "agent-fe", name: "frontend" }));
  localStorage.setItem("environmentAtom", JSON.stringify({ environment_id: "env-fe", name: "live" }));
});

describe("BreadCrumbs", () => {
  it("follows the route, not the last visited agent", () => {
    path.current = "/environment/env-be";
    render(<BreadCrumbs commitHash={"abc"} />);
    expect(screen.getByText("backend").closest("a")?.getAttribute("href")).toBe("/agent/agent-be");
    expect(screen.queryByText("frontend")).toBeNull();
    expect(screen.getByText("repro").closest("a")?.getAttribute("href")).toBe("/project/proj-1");
    expect(screen.getByText("live - Flags")).toBeTruthy();
  });

  it("shows only the project on a project page", () => {
    path.current = "/project/proj-1";
    render(<BreadCrumbs commitHash={"abc"} />);
    expect(screen.getByText("repro")).toBeTruthy();
    expect(screen.queryByText(/frontend|backend|Flags/)).toBeNull();
  });
});
