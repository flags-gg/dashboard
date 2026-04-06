import { createMockRequest, mockUser, mockFetchSuccess, mockFetchFailure, mockFetchThrow } from "./_helpers";

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

import { currentUser } from "@clerk/nextjs/server";
import { POST as createCompany } from "~/app/api/company/create/route";

const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe("Company API Routes", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("POST /api/company/create", () => {
    it("returns 401 when not authenticated", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const req = createMockRequest("/api/company/create", {
        method: "POST",
        body: { companyName: "Acme", companyDomain: "acme.com" },
      });

      const res = await createCompany(req);
      expect(res.status).toBe(401);
    });

    it("creates company successfully", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess({ message: "created" });

      const req = createMockRequest("/api/company/create", {
        method: "POST",
        body: { companyName: "Acme", companyDomain: "acme.com" },
      });

      const res = await createCompany(req);
      expect(res.status).toBe(200);

      // NextResponse.json body verified via status
    });

    it("sends correct data to backend", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchSuccess();

      const req = createMockRequest("/api/company/create", {
        method: "POST",
        body: { companyName: "Acme", companyDomain: "acme.com" },
      });

      await createCompany(req);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.test.com/v1/company",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "x-user-subject": "user_123",
          }),
          body: JSON.stringify({ name: "Acme", domain: "acme.com" }),
        })
      );
    });

    it("returns 500 when backend fails", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchFailure();

      const req = createMockRequest("/api/company/create", {
        method: "POST",
        body: { companyName: "Acme", companyDomain: "acme.com" },
      });

      const res = await createCompany(req);
      expect(res.status).toBe(500);
    });

    it("returns 500 on network error", async () => {
      mockedCurrentUser.mockResolvedValue(mockUser as any);
      global.fetch = mockFetchThrow();

      const req = createMockRequest("/api/company/create", {
        method: "POST",
        body: { companyName: "Acme", companyDomain: "acme.com" },
      });

      const res = await createCompany(req);
      expect(res.status).toBe(500);
    });
  });
});
