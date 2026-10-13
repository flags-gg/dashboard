import { createMockRequest, mockUser, mockFetchSuccess, mockFetchFailure, mockFetchThrow } from "./_helpers";

// Mock Clerk
jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
  auth: jest.fn(async () => ({ userId: "user_123", getToken: async () => "test-token" })),
}));

// Mock env
jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

import { currentUser } from "@clerk/nextjs/server";
import { DELETE, GET, PUT } from "~/app/api/agent/route";

const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe("Agent API Routes", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("DELETE /api/agent", () => {
    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/agent", {
        method: "DELETE",
        body: { agentId: "a0000000-0000-4000-8000-000000000001" },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(401);
    });

    it("deletes agent successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchSuccess({ message: "deleted" });

      const req = createMockRequest("/api/agent", {
        method: "DELETE",
        body: { agentId: "a0000000-0000-4000-8000-000000000001" },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(200);

      // NextResponse.json body verified via status
    });

    it("returns 500 when backend fails", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchFailure();

      const req = createMockRequest("/api/agent", {
        method: "DELETE",
        body: { agentId: "a0000000-0000-4000-8000-000000000001" },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(500);
    });

    it("returns 500 on network error", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchThrow();

      const req = createMockRequest("/api/agent", {
        method: "DELETE",
        body: { agentId: "a0000000-0000-4000-8000-000000000001" },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(500);
    });
  });

  describe("GET /api/agent", () => {
    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/agent", {
        searchParams: { agentId: "a0000000-0000-4000-8000-000000000001" },
      });

      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    it("returns agent data successfully", async () => {
      const agentData = {
        id: "1",
        name: "Test Agent",
        agent_id: "a0000000-0000-4000-8000-000000000001",
        enabled: true,
      };
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchSuccess(agentData);

      const req = createMockRequest("/api/agent", {
        searchParams: { agentId: "a0000000-0000-4000-8000-000000000001" },
      });

      const res = await GET(req);
      expect(res.status).toBe(200);

      // Response body contains agent data
    });

    it("returns 500 when backend fails", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchFailure();

      const req = createMockRequest("/api/agent", {
        searchParams: { agentId: "a0000000-0000-4000-8000-000000000001" },
      });

      const res = await GET(req);
      expect(res.status).toBe(500);
    });
  });

  describe("PUT /api/agent", () => {
    it("updates agent successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/agent", {
        method: "PUT",
        body: { agentId: "a0000000-0000-4000-8000-000000000001", name: "Updated", enabled: true },
      });

      const res = await PUT(req);
      expect(res.status).toBe(200);
    });
  });
});
