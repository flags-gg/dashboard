import { getProjectTreeContext, loadProjectTree } from "~/components/SideBar/project-tree";
import type { FlagAgent, IEnvironment, IProject } from "~/lib/interfaces";

const projects = [
  { project_id: "project-a", name: "Project A" },
  { project_id: "project-b", name: "Project B" },
] as IProject[];
const agents = [
  { agent_id: "agent-z", name: "Zulu", project_info: { project_id: "project-a" } },
  { agent_id: "agent-a", name: "Alpha", project_info: { project_id: "project-a" } },
  { agent_id: "agent-b", name: "Other", project_info: { project_id: "project-b" } },
] as FlagAgent[];
const environments = [
  { environment_id: "env-prod", name: "Production", agent_id: "agent-a", level: 2 },
  { environment_id: "env-dev", name: "Development", agent_id: "agent-a", level: 1 },
  { environment_id: "env-other", name: "Other", agent_id: "agent-b", level: 1 },
] as IEnvironment[];
const data = { projects, agents, environments };

describe("project sidebar tree", () => {
  it("reads the wrapped list responses returned by the API", async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(async (url: string) => ({
      ok: true,
      json: async () => {
        if (url === "/api/project/list") return { projects };
        if (url === "/api/agent/list") return { agents };
        return { environments };
      },
    })) as unknown as typeof fetch;

    try {
      expect(await loadProjectTree()).toEqual(data);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("groups every agent and environment under the current project", () => {
    const tree = getProjectTreeContext("/project/project-a", data);
    expect(tree?.project.name).toBe("Project A");
    expect(tree?.agents.map((agent) => agent.name)).toEqual(["Alpha", "Zulu"]);
    expect(tree?.agents[0]?.environments.map((environment) => environment.name)).toEqual([
      "Development", "Production",
    ]);
    expect(tree?.agents[1]?.environments).toEqual([]);
  });

  it("resolves an agent or environment deep link without relying on prior selection", () => {
    expect(getProjectTreeContext("/agent/agent-z", data)?.project.project_id).toBe("project-a");
    expect(getProjectTreeContext("/environment/env-prod", data)?.project.project_id).toBe("project-a");
    expect(getProjectTreeContext("/secretmenu/menu-1", data, "env-prod")?.project.project_id).toBe("project-a");
  });

  it("does not show another project's agents or unknown resources", () => {
    expect(getProjectTreeContext("/project/project-b", data)?.agents.map((agent) => agent.agent_id)).toEqual(["agent-b"]);
    expect(getProjectTreeContext("/environment/missing", data)).toBeNull();
  });
});
