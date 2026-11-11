import { createMockRequest, mockFetchSuccess, mockFetchFailure } from "./_helpers";
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@clerk/nextjs/server", () => ({ auth: jest.fn(async () => ({ userId: "user_a", getToken: async () => "session-token" })) }));
jest.mock("~/env", () => ({ env: { API_SERVER: "https://api.test/v1" } }));
import { auth } from "@clerk/nextjs/server";
import { proxyWebhooks } from "~/server/webhooks";
import { GET as staffGET } from "~/app/api/staff/[section]/route";
import { staffAccess } from "~/server/staff";
const mockedAuth = auth as unknown as jest.Mock;
const originalFetch = global.fetch;
const endpoint = "123e4567-e89b-12d3-a456-426614174000";
beforeEach(() => { jest.clearAllMocks(); mockedAuth.mockResolvedValue({ userId: "user_a", getToken: async () => "session-token" }); });
afterAll(() => { global.fetch = originalFetch; });

it("requires a session for staff and webhook proxies", async () => {
  mockedAuth.mockResolvedValue({ userId: null });
  global.fetch = jest.fn();
  expect((await proxyWebhooks(createMockRequest("/api/company/webhooks"))).status).toBe(401);
  expect((await staffGET(createMockRequest("/api/staff/stats"), { params: Promise.resolve({ section: "stats" }) })).status).toBe(401);
  expect(global.fetch).not.toHaveBeenCalled();
});
it("rejects paths outside the fixed staff and webhook operation lists", async () => {
  global.fetch = jest.fn();
  expect((await proxyWebhooks(createMockRequest("/api/company/webhooks"), ["..", "user"])).status).toBe(404);
  expect((await proxyWebhooks(createMockRequest("/api/company/webhooks", { method: "PATCH", body: {} }), ["not-a-uuid"])).status).toBe(404);
  expect((await staffGET(createMockRequest("/api/staff/stats"), { params: Promise.resolve({ section: "../company" }) })).status).toBe(404);
  expect(global.fetch).not.toHaveBeenCalled();
});
it("forwards Clerk JWTs and webhook filters, preserving backend denials", async () => {
  global.fetch = mockFetchSuccess({ deliveries: [] });
  await proxyWebhooks(createMockRequest("/api/company/webhooks/deliveries", { searchParams: { endpoint, before: "42" } }), ["deliveries"]);
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/company/webhook-deliveries?before=42&endpoint=" + endpoint), expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer session-token" }), cache: "no-store" }));
  global.fetch = mockFetchFailure(404);
  expect((await proxyWebhooks(createMockRequest("/api/company/webhooks/" + endpoint, { method: "DELETE" }), [endpoint])).status).toBe(404);
});
it("only grants staff UI access after a successful backend staff user check", async () => {
  global.fetch = mockFetchSuccess({ staff: true });
  expect(await staffAccess()).toBe("allowed");
  global.fetch = mockFetchFailure(404);
  expect(await staffAccess()).toBe("denied");
  global.fetch = mockFetchFailure(503);
  expect(await staffAccess()).toBe("unavailable");
});
it("forwards staff search as query data and preserves 404", async () => {
  global.fetch = mockFetchSuccess({ total: 0, items: [] });
  await staffGET(createMockRequest("/api/staff/users", { searchParams: { q: "a&company=x", page: "2" } }), { params: Promise.resolve({ section: "users" }) });
  expect(global.fetch).toHaveBeenCalledWith("https://api.test/v1/staff/users?q=a%26company%3Dx&page=2", expect.anything());
  global.fetch = mockFetchFailure(404);
  expect((await staffGET(createMockRequest("/api/staff/stats"), { params: Promise.resolve({ section: "stats" }) })).status).toBe(404);
});
