import { createMockRequest, mockUser, mockFetchSuccess, mockFetchFailure } from "./_helpers";

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
  auth: jest.fn(async () => ({ userId: "user_123", getToken: async () => "test-token" })),
}));

jest.mock("~/env", () => ({
  env: { API_SERVER: "https://api.test.com/v1" },
}));

import { currentUser } from "@clerk/nextjs/server";
import { DELETE as archiveFlag } from "~/app/api/flag/archive/route";
import { PATCH as setRollout } from "~/app/api/flag/rollout/route";
import { PUT as setRules } from "~/app/api/flag/rules/route";
import { GET as listTokens, POST as createToken, DELETE as revokeToken } from "~/app/api/company/integration-token/route";

const mockedCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;
const signedIn = () => mockedCurrentUser.mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof currentUser>>);
const AGENT = "123e4567-e89b-12d3-a456-426614174000";

describe("flag archive and integration tokens", () => {
  const originalFetch = global.fetch;
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => { global.fetch = originalFetch; });

  it("archive needs a user and a valid agent id", async () => {
    mockedCurrentUser.mockResolvedValue(null);
    expect((await archiveFlag(createMockRequest("/api/flag/archive", { method: "DELETE", body: { agent_id: AGENT, name: "x" } }))).status).toBe(401);
    signedIn();
    expect((await archiveFlag(createMockRequest("/api/flag/archive", { method: "DELETE", body: { agent_id: "../x", name: "x" } }))).status).toBe(400);
  });

  it("archive encodes the flag name into the API path", async () => {
    signedIn();
    global.fetch = mockFetchSuccess({}, 204);
    const res = await archiveFlag(createMockRequest("/api/flag/archive", { method: "DELETE", body: { agent_id: AGENT, name: "new nav/x" } }));
    expect(res.status).toBe(204);
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.test.com/v1/agent/${AGENT}/flags/new%20nav%2Fx`,
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("archive passes a 404 through", async () => {
    signedIn();
    global.fetch = mockFetchFailure(404);
    expect((await archiveFlag(createMockRequest("/api/flag/archive", { method: "DELETE", body: { agent_id: AGENT, name: "x" } }))).status).toBe(404);
  });

  it("tokens: list, create (returns raw token once), revoke", async () => {
    mockedCurrentUser.mockResolvedValue(null);
    expect((await listTokens()).status).toBe(401);

    signedIn();
    global.fetch = mockFetchSuccess({ tokens: [] });
    expect(await (await listTokens()).json()).toEqual({ tokens: [] });

    expect((await createToken(createMockRequest("/api/company/integration-token", { method: "POST", body: { name: " " } }))).status).toBe(400);
    global.fetch = mockFetchSuccess({ name: "Tracklines", token: "flg_abc" }, 201);
    const created = await createToken(createMockRequest("/api/company/integration-token", { method: "POST", body: { name: " Tracklines " } }));
    expect(created.status).toBe(201);
    expect(await created.json()).toEqual({ name: "Tracklines", token: "flg_abc" });
    expect(global.fetch).toHaveBeenCalledWith("https://api.test.com/v1/company/integration-token",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ name: "Tracklines" }) }));

    expect((await revokeToken(createMockRequest("/api/company/integration-token", { method: "DELETE", body: { id: "1/../x" } }))).status).toBe(400);
    global.fetch = mockFetchSuccess({}, 204);
    expect((await revokeToken(createMockRequest("/api/company/integration-token", { method: "DELETE", body: { id: 7 } }))).status).toBe(204);
    expect(global.fetch).toHaveBeenCalledWith("https://api.test.com/v1/company/integration-token/7", expect.objectContaining({ method: "DELETE" }));
  });

  it("rollout validates the percentage and forwards it", async () => {
    signedIn();
    const req = (body: Record<string, unknown>) => createMockRequest("/api/flag/rollout", { method: "PATCH", body });
    expect((await setRollout(req({ flag_id: "42", rollout: 101 }))).status).toBe(400);
    expect((await setRollout(req({ flag_id: "42", rollout: 2.5 }))).status).toBe(400);
    expect((await setRollout(req({ flag_id: "../x", rollout: 5 }))).status).toBe(400);
    global.fetch = mockFetchSuccess({});
    expect((await setRollout(req({ flag_id: "42", rollout: 25 }))).status).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith("https://api.test.com/v1/flag/42/rollout",
      expect.objectContaining({ method: "PATCH", body: JSON.stringify({ rollout: 25 }) }));
  });

  it("rules are forwarded and the API's validation error is passed through", async () => {
    signedIn();
    const req = (body: Record<string, unknown>) => createMockRequest("/api/flag/rules", { method: "PUT", body });
    expect((await setRules(req({ flag_id: "../x", rules: [] }))).status).toBe(400);
    expect((await setRules(req({ flag_id: "42", rules: "nope" }))).status).toBe(400);

    const rules = [{ attribute: "groups", operator: "in", values: ["beta"], serve: true }];
    global.fetch = mockFetchSuccess({});
    expect((await setRules(req({ flag_id: "42", rules }))).status).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith("https://api.test.com/v1/flag/42/rules",
      expect.objectContaining({ method: "PUT", body: JSON.stringify({ rules }) }));

    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 400, text: async () => '{"error":"rule 1: unknown operator \\"regex\\""}' });
    const bad = await setRules(req({ flag_id: "42", rules }));
    expect(bad.status).toBe(400);
    expect((await bad.json()).error).toContain("unknown operator");
  });
});
