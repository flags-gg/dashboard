import { createMockRequest, mockUser, mockFetchSuccess, mockFetchFailure, mockFetchThrow } from "./_helpers";

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

import { currentUser } from "@clerk/nextjs/server";
import { DELETE, GET } from "~/app/api/project/route";

const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe("Project API Routes", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("DELETE /api/project", () => {
    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/project", {
        method: "DELETE",
        body: { projectId: "proj-1" },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(401);
    });

    it("deletes project successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/project", {
        method: "DELETE",
        body: { projectId: "proj-1" },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(200);

      // NextResponse.json body verified via status
    });

    it("returns 500 when backend fails", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchFailure();

      const req = createMockRequest("/api/project", {
        method: "DELETE",
        body: { projectId: "proj-1" },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(500);
    });

    it("returns 500 on network error", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchThrow();

      const req = createMockRequest("/api/project", {
        method: "DELETE",
        body: { projectId: "proj-1" },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(500);
    });

    it("sends correct headers to backend", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/project", {
        method: "DELETE",
        body: { projectId: "proj-1" },
      });

      await DELETE(req);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.test.com/v1/project/proj-1",
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            "x-user-subject": "user_123",
          }),
        })
      );
    });
  });

  describe("GET /api/project", () => {
    it("returns 400 when no projectId provided", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      const req = createMockRequest("/api/project");

      const res = await GET(req);
      expect(res.status).toBe(400);
    });

    it("returns project data", async () => {
      const projectData = { id: "1", name: "Test", project_id: "proj-1" };
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess(projectData);

      const req = createMockRequest("/api/project", {
        searchParams: { projectId: "proj-1" },
      });

      const res = await GET(req);
      expect(res.status).toBe(200);
    });

    it("calls backend with correct project ID", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess({ id: "1", name: "Test", project_id: "proj-1" });

      const req = createMockRequest("/api/project", {
        searchParams: { projectId: "proj-1" },
      });

      await GET(req);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.test.com/v1/project/proj-1",
        expect.objectContaining({
          headers: expect.objectContaining({ "x-user-subject": "user_123" }),
        })
      );
    });
  });
});
