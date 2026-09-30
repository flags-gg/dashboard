import { createMockRequest, mockUser, mockFetchSuccess } from "./_helpers";

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

// Keep JSON bodies intact with the suite's Web API polyfills.
jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) => new Response(JSON.stringify(data), init),
  },
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { POST as createEnvironment } from "~/app/api/environment/create/route";
import { POST as cloneEnvironment } from "~/app/api/environment/clone/route";
import { GET as getEnvironments } from "~/app/api/environment/list/route";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe("Environment API Routes", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("POST /api/environment/create", () => {
    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/environment/create", {
        method: "POST",
        body: { agentId: "agent-1", name: "Staging" },
      });

      const res = await createEnvironment(req);
      expect(res.status).toBe(401);
    });

    it("creates environment successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchSuccess({ environment_id: "env-new" });

      const req = createMockRequest("/api/environment/create", {
        method: "POST",
        body: { agentId: "agent-1", name: "Staging" },
      });

      const res = await createEnvironment(req);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/environment/list", () => {
    it("returns 401 when not authenticated", async () => {
      mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
      const res = await getEnvironments();
      expect(res.status).toBe(401);
    });

    it("returns environments list", async () => {
      const envData = [
        { id: "1", name: "Production", environment_id: "env-1" },
        { id: "2", name: "Staging", environment_id: "env-2" },
      ];
      mockedAuth.mockResolvedValue({ userId: mockUser.id } as Awaited<ReturnType<typeof auth>>);
      global.fetch = mockFetchSuccess(envData);

      const res = await getEnvironments();
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/environment/clone", () => {
    const request = () => createMockRequest("/api/environment/clone", {
      method: "POST",
      body: { agentId: "agent-1", environmentId: "dev", name: "Production" },
    });

    it("requires authentication", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      expect((await cloneEnvironment(request())).status).toBe(401);
    });

    it("returns the child's identifier for query invalidation", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchSuccess({ environmentId: "prod" }, 201);
      const response = await cloneEnvironment(request());
      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({ environment_id: "prod" });
      expect(global.fetch).toHaveBeenCalledWith("https://api.test.com/v1/agent/agent-1/dev", expect.objectContaining({
        method: "POST", body: JSON.stringify({ name: "Production" }),
      }));
    });

    it("preserves actionable backend errors", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 409, text: async () => "this environment already has a child\n" });
      const response = await cloneEnvironment(request());
      expect(response.status).toBe(409);
      expect(await response.json()).toEqual({ error: "this environment already has a child" });
    });

    it("keeps internal database details out of the response", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, text: async () => "database details" });
      const response = await cloneEnvironment(request());
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "Failed to create child environment" });
    });
  });
});
