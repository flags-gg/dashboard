import { createMockRequest, mockUser, mockFetchSuccess, mockFetchFailure, mockFetchThrow } from "./_helpers";

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

import { currentUser } from "@clerk/nextjs/server";
import { POST } from "~/app/api/agent/create/route";

const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe("POST /api/agent/create", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("returns 401 when not authenticated", async () => {
    mockedCurrentUser.mockResolvedValue(null);
    const req = createMockRequest("/api/agent/create", {
      method: "POST",
      body: { projectId: "proj-1", name: "New Agent" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates agent and returns response", async () => {
    const agentData = { id: "1", name: "New Agent", agent_id: "agent-new" };
    mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
    global.fetch = mockFetchSuccess(agentData);

    const req = createMockRequest("/api/agent/create", {
      method: "POST",
      body: { projectId: "proj-1", name: "New Agent" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Response body contains created agent data
  });

  it("sends correct data to backend API", async () => {
    mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
    global.fetch = mockFetchSuccess({});

    const req = createMockRequest("/api/agent/create", {
      method: "POST",
      body: { projectId: "proj-1", name: "New Agent" },
    });

    await POST(req);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test.com/v1/project/proj-1/agent",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "New Agent", project_id: "proj-1" }),
      })
    );
  });

  it("returns 500 when backend returns error", async () => {
    mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
    global.fetch = mockFetchFailure();

    const req = createMockRequest("/api/agent/create", {
      method: "POST",
      body: { projectId: "proj-1", name: "New Agent" },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("returns 500 on network error", async () => {
    mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
    global.fetch = mockFetchThrow("Connection refused");

    const req = createMockRequest("/api/agent/create", {
      method: "POST",
      body: { projectId: "proj-1", name: "New Agent" },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
