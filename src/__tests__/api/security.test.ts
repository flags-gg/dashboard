const mockEnv = { API_SERVER: "https://api.test.com/v1", STRIPE_SECRET: "sk_test_x" };
const mockCreateSession = jest.fn();
const mockDeleteUser = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
  auth: jest.fn(async () => ({ userId: "user_123", getToken: async () => "test-token" })),
  clerkClient: jest.fn(async () => ({ users: { deleteUser: mockDeleteUser } })),
}));
jest.mock("~/env", () => ({ env: mockEnv }));
jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));
jest.mock("next/server", () => ({
  NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) },
}));
jest.mock("stripe", () => ({
  __esModule: true,
  default: jest.fn(() => ({ checkout: { sessions: { create: mockCreateSession } } })),
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { createMockRequest, mockUser, mockFetchSuccess, mockFetchFailure } from "./_helpers";
import { authHeader, isFlagId, isUploadedImageUrl, isUuid } from "~/server/api";
import { GET as getAgentRoute, DELETE as deleteAgent } from "~/app/api/agent/route";
import { DELETE as deleteEnvironment } from "~/app/api/environment/route";
import { POST as cloneEnvironment } from "~/app/api/environment/clone/route";
import { DELETE as deleteFlag } from "~/app/api/flag/delete/route";
import { POST as toggleFlag } from "~/app/api/flag/route";
import { GET as getProjectRoute, PUT as putProject } from "~/app/api/project/route";
import { PUT as projectImage } from "~/app/api/project/image/route";
import { GET as projectLimits } from "~/app/api/project/limits/route";
import { POST as getMenu } from "~/app/api/secretmenu/route";
import { PUT as saveSequence, POST as createMenu } from "~/app/api/secretmenu/sequence/route";
import { POST as getStyle } from "~/app/api/secretmenu/style/route";
import { PUT as userImage } from "~/app/api/user/image/route";
import { PUT as companyImage } from "~/app/api/company/image/route";
import { DELETE as deleteUser } from "~/app/api/user/delete/route";
import { POST as startUpgrade, PUT as finishUpgrade } from "~/app/api/company/upgrade/route";
import { getAgent } from "~/app/api/agent/agent";
import { getEnvironment } from "~/app/api/environment/environment";
import { getProject } from "~/app/api/project/project";
import { getSecretMenu } from "~/app/api/secretmenu/data";

const mockedCurrentUser = currentUser as jest.Mock;
const UUID = "b0000000-0000-4000-8000-000000000001";
const TRAVERSAL = "../company/users";

describe("security hardening", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedCurrentUser.mockResolvedValue(mockUser);
    global.fetch = mockFetchSuccess({});
  });
  afterAll(() => { global.fetch = originalFetch; });

  describe("id validation (FLA-28)", () => {
    it("accepts the API's id formats only", () => {
      expect(isUuid(UUID)).toBe(true);
      expect(isUuid("42")).toBe(false);
      expect(isUuid(`${UUID}/../x`)).toBe(false);
      expect(isFlagId("42")).toBe(true);
      expect(isFlagId(UUID)).toBe(true);
      expect(isFlagId("../1")).toBe(false);
      expect(isFlagId(undefined)).toBe(false);
    });

    it.each([
      ["GET /api/agent", () => getAgentRoute(createMockRequest("/api/agent", { searchParams: { agentId: TRAVERSAL } }))],
      ["DELETE /api/agent", () => deleteAgent(createMockRequest("/api/agent", { method: "DELETE", body: { agentId: TRAVERSAL } }))],
      ["DELETE /api/environment", () => deleteEnvironment(createMockRequest("/api/environment", { method: "DELETE", body: { environmentId: TRAVERSAL } }))],
      ["POST /api/environment/clone", () => cloneEnvironment(createMockRequest("/api/environment/clone", { method: "POST", body: { agentId: UUID, environmentId: TRAVERSAL, name: "x" } }))],
      ["DELETE /api/flag/delete", () => deleteFlag(createMockRequest("/api/flag/delete", { method: "DELETE", body: { flag_id: "../1" } }))],
      ["POST /api/flag", () => toggleFlag(createMockRequest("/api/flag", { method: "POST", body: { flag: { enabled: true, details: { id: "1/../2", name: "x" } } } }))],
      ["GET /api/project", () => getProjectRoute(createMockRequest("/api/project", { searchParams: { projectId: TRAVERSAL } }))],
      ["PUT /api/project", () => putProject(createMockRequest("/api/project", { method: "PUT", body: { projectId: TRAVERSAL, name: "x", enabled: true } }))],
      ["PUT /api/project/image", () => projectImage(createMockRequest("/api/project/image", { method: "PUT", body: { project_id: TRAVERSAL, image: "https://utfs.io/f/a.png" } }))],
      ["GET /api/project/limits", () => projectLimits(createMockRequest("/api/project/limits", { searchParams: { project_id: TRAVERSAL } }))],
      ["POST /api/secretmenu", () => getMenu(createMockRequest("/api/secretmenu", { method: "POST", body: { menuId: TRAVERSAL } }))],
      ["PUT /api/secretmenu/sequence", () => saveSequence(createMockRequest("/api/secretmenu/sequence", { method: "PUT", body: { menuId: TRAVERSAL, sequence: [] } }))],
      ["POST /api/secretmenu/sequence", () => createMenu(createMockRequest("/api/secretmenu/sequence", { method: "POST", body: { environmentId: TRAVERSAL, sequence: [] } }))],
      ["POST /api/secretmenu/style", () => getStyle(createMockRequest("/api/secretmenu/style", { method: "POST", body: { menuId: TRAVERSAL } }))],
    ])("%s rejects ../ ids without calling the API", async (_name, call) => {
      const res = await call();
      expect(res.status).toBe(400);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("rejects ../ ids from page params", async () => {
      await expect(getAgent(TRAVERSAL)).rejects.toThrow("Invalid agent id");
      await expect(getSecretMenu(TRAVERSAL)).rejects.toThrow("Invalid secret menu id");
      expect((await getEnvironment(TRAVERSAL)).error?.message).toBe("Invalid environment id");
      expect(await getProject(TRAVERSAL)).toEqual(Error("Invalid project id"));
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("secret menu routes return parsed JSON, not the upstream response", async () => {
      global.fetch = mockFetchSuccess({ menu_id: UUID, sequence: ["a"] });
      const res = await getMenu(createMockRequest("/api/secretmenu", { method: "POST", body: { menuId: UUID } }));
      expect(res).toBeInstanceOf(Response);
      expect(await res.json()).toEqual({ menu_id: UUID, sequence: ["a"] });
    });
  });

  describe("API auth (FLA-25)", () => {
    it("sends the Clerk session token and no x-user-subject", async () => {
      await getAgentRoute(createMockRequest("/api/agent", { searchParams: { agentId: UUID } }));
      const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>;
      expect(headers.Authorization).toBe("Bearer test-token");
      expect(headers).not.toHaveProperty("x-user-subject");
    });

    it("refuses to call the API without a session token", async () => {
      (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: null, getToken: async () => null });
      await expect(authHeader()).rejects.toThrow("No session token");
    });
  });

  describe("project auth (FLA-33e)", () => {
    it("GET /api/project returns 401 when signed out", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const res = await getProjectRoute(createMockRequest("/api/project", { searchParams: { projectId: UUID } }));
      expect(res.status).toBe(401);
    });

    it("PUT /api/project returns 401 instead of throwing when signed out", async () => {
      mockedCurrentUser.mockResolvedValue(null);
      const res = await putProject(createMockRequest("/api/project", { method: "PUT", body: { projectId: UUID, name: "x", enabled: true } }));
      expect(res.status).toBe(401);
    });

    it("GET /api/project surfaces API failures instead of {} 200", async () => {
      global.fetch = mockFetchFailure(403);
      const res = await getProjectRoute(createMockRequest("/api/project", { searchParams: { projectId: UUID } }));
      expect(res.status).toBe(500);
    });
  });

  describe("image urls (FLA-33a)", () => {
    it.each([
      ["https://utfs.io/f/abc.png", true],
      ["https://app123.ufs.sh/f/abc.png", true],
      ["http://utfs.io/f/abc.png", false],
      ["https://utfs.io:8443/f/abc.png", false],
      ["https://evil.com/utfs.io.png", false],
      ["https://utfs.io.evil.com/a.png", false],
      ["https://evilufs.sh/a.png", false],
      ["javascript:alert(1)", false],
      ["not a url", false],
    ])("%s allowed=%s", (url, allowed) => {
      expect(isUploadedImageUrl(url)).toBe(allowed);
    });

    it.each([
      ["user", () => userImage(createMockRequest("/api/user/image", { method: "PUT", body: { image: "https://evil.com/a.png" } }))],
      ["company", () => companyImage(createMockRequest("/api/company/image", { method: "PUT", body: { image: "https://evil.com/a.png" } }))],
      ["project", () => projectImage(createMockRequest("/api/project/image", { method: "PUT", body: { project_id: UUID, image: "https://evil.com/a.png" } }))],
    ])("%s image route rejects foreign hosts", async (_name, call) => {
      expect((await call()).status).toBe(400);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("account delete (FLA-32)", () => {
    it("deletes the Clerk user after the API delete succeeds", async () => {
      const res = await deleteUser();
      expect(res.status).toBe(200);
      expect(mockDeleteUser).toHaveBeenCalledWith(mockUser.id);
    });

    it("keeps the Clerk user when the API delete fails", async () => {
      global.fetch = mockFetchFailure(500);
      const res = await deleteUser();
      expect(res.status).toBe(500);
      expect(mockDeleteUser).not.toHaveBeenCalled();
    });
  });

  describe("plan upgrade (FLA-26)", () => {
    const pricing = { prices: [{ title: "pro", stripe: { price_id: "price_live_pro", dev_price_id: "price_test_pro" } }] };

    beforeEach(() => {
      global.fetch = mockFetchSuccess(pricing);
      mockCreateSession.mockResolvedValue({ client_secret: "secret" });
    });
    afterEach(() => { mockEnv.STRIPE_SECRET = "sk_test_x"; });

    it("rejects plans the API does not offer", async () => {
      const res = await startUpgrade(createMockRequest("/api/company/upgrade", { method: "POST", body: { plan: "price_attacker" } }));
      expect(res.status).toBe(400);
      expect(mockCreateSession).not.toHaveBeenCalled();
    });

    it("uses the test price with a test key and binds the session to the user", async () => {
      const res = await startUpgrade(createMockRequest("/api/company/upgrade", { method: "POST", body: { plan: "pro", priceId: "price_attacker" } }));
      expect(res.status).toBe(200);
      expect(mockCreateSession).toHaveBeenCalledWith(expect.objectContaining({
        line_items: [{ price: "price_test_pro", quantity: 1 }],
        client_reference_id: mockUser.id,
        metadata: { userId: mockUser.id, priceId: "price_test_pro" },
      }));
    });

    it("returns to the dashboard upgrade page on the request's origin", async () => {
      await startUpgrade(createMockRequest("/api/company/upgrade", { method: "POST", body: { plan: "pro" } }));
      const { return_url } = mockCreateSession.mock.calls.at(-1)[0];
      expect(return_url).toMatch(/^https?:\/\/[^/]+\/company\/upgrade\?session_id=\{CHECKOUT_SESSION_ID\}$/);
    });

    it("uses the live price with a live key", async () => {
      mockEnv.STRIPE_SECRET = "sk_live_x";
      await startUpgrade(createMockRequest("/api/company/upgrade", { method: "POST", body: { plan: "pro" } }));
      expect(mockCreateSession).toHaveBeenCalledWith(expect.objectContaining({
        line_items: [{ price: "price_live_pro", quantity: 1 }],
      }));
    });

    it("PUT only forwards a checkout session id", async () => {
      expect((await finishUpgrade(createMockRequest("/api/company/upgrade", { method: "PUT", body: { sessionId: "../x" } }))).status).toBe(400);
      global.fetch = mockFetchSuccess({});
      expect((await finishUpgrade(createMockRequest("/api/company/upgrade", { method: "PUT", body: { sessionId: "cs_test_abc" } }))).status).toBe(200);
      expect((global.fetch as jest.Mock).mock.calls[0][1].body).toBe(JSON.stringify({ sessionId: "cs_test_abc" }));
    });
  });
});
