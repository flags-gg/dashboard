import { createMockRequest, mockUser, mockFetchSuccess, mockFetchFailure, mockFetchThrow } from "./_helpers";

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

import { currentUser } from "@clerk/nextjs/server";
import { POST as toggleFlag } from "~/app/api/flag/route";
import { DELETE as deleteFlag } from "~/app/api/flag/delete/route";
import { POST as createFlag } from "~/app/api/flag/create/route";
import { POST as editFlag } from "~/app/api/flag/edit/route";

const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe("Flag API Routes", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("POST /api/flag (toggle)", () => {
    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/flag", {
        method: "POST",
        body: {
          flag: {
            enabled: true,
            details: { id: "flag-1", name: "Test Flag", lastChanged: "", promoted: false },
          },
        },
      });

      const res = await toggleFlag(req);
      expect(res.status).toBe(401);
    });

    it("toggles flag successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/flag", {
        method: "POST",
        body: {
          flag: {
            enabled: true,
            details: { id: "flag-1", name: "Test Flag", lastChanged: "", promoted: false },
          },
        },
      });

      const res = await toggleFlag(req);
      expect(res.status).toBe(200);

      // NextResponse.json body verified via status
    });

    it("sends negated enabled value to backend", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/flag", {
        method: "POST",
        body: {
          flag: {
            enabled: true,
            details: { id: "flag-1", name: "Test", lastChanged: "", promoted: false },
          },
        },
      });

      await toggleFlag(req);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.test.com/v1/flag/flag-1",
        expect.objectContaining({
          method: "PATCH",
          body: expect.stringContaining('"enabled":false'),
        })
      );
    });
  });

  describe("DELETE /api/flag/delete", () => {
    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/flag/delete", {
        method: "DELETE",
        body: { flag_id: "flag-1" },
      });

      const res = await deleteFlag(req);
      expect(res.status).toBe(401);
    });

    it("deletes flag successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/flag/delete", {
        method: "DELETE",
        body: { flag_id: "flag-1" },
      });

      const res = await deleteFlag(req);
      expect(res.status).toBe(200);

      // NextResponse.json body verified via status
    });

    it("returns 500 on network error", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchThrow();

      const req = createMockRequest("/api/flag/delete", {
        method: "DELETE",
        body: { flag_id: "flag-1" },
      });

      const res = await deleteFlag(req);
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/flag/create", () => {
    it("creates flag successfully", async () => {
      const flagData = { enabled: true, details: { id: "new-flag", name: "New Flag" } };
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess(flagData);

      const req = createMockRequest("/api/flag/create", {
        method: "POST",
        body: { name: "New Flag", environment_id: "env-1", agent_id: "agent-1" },
      });

      const res = await createFlag(req);
      expect(res.status).toBe(200);
    });

    it("returns 500 when backend fails", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchFailure();

      const req = createMockRequest("/api/flag/create", {
        method: "POST",
        body: { name: "New Flag", environment_id: "env-1", agent_id: "agent-1" },
      });

      const res = await createFlag(req);
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/flag/edit", () => {
    it("edits flag name successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/flag/edit", {
        method: "POST",
        body: { flag_id: "flag-1", newName: "Renamed Flag" },
      });

      const res = await editFlag(req);
      expect(res.status).toBe(200);
    });
  });
});
