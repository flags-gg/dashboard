import { createMockRequest, mockUser, mockFetchSuccess } from "./_helpers";

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { POST as createEnvironment } from "~/app/api/environment/create/route";
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
});
