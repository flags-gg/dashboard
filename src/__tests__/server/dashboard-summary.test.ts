jest.mock("~/env", () => ({ env: { API_SERVER: "http://orchestrator:8080" } }));

import { getDashboardSummary } from "~/server/get-dashboard-summary";

describe("dashboard summary", () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; });

  it("renders a new company with no projects or flags as empty lists", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ projects: null, agents: null, environments: null, allFlags: null,
        recentFlagChanges: null, environmentCoverage: null, stats: { requestTotals: {} } }),
    });
    const result = await getDashboardSummary("local-user");
    expect(result.projects).toEqual([]);
    expect(result.agents).toEqual([]);
    expect(result.environments).toEqual([]);
    expect(result.allFlags).toEqual([]);
    expect(result.recentFlagChanges).toEqual([]);
    expect(result.environmentCoverage).toEqual([]);
    expect(global.fetch).toHaveBeenCalledWith("http://orchestrator:8080/stats/dashboard", expect.objectContaining({
      headers: expect.objectContaining({ "x-user-subject": "local-user" }),
    }));
  });

  it("includes the API status when fetching fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 });
    await expect(getDashboardSummary("local-user")).rejects.toThrow("Failed to fetch /stats/dashboard (401)");
  });
});
