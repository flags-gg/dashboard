jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
  auth: jest.fn(async () => ({ userId: "user_123", getToken: async () => "test-token" })),
}));
jest.mock("~/env", () => ({ env: { API_SERVER: "http://orchestrator:8080" } }));
jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));
jest.mock("next/server", () => ({
  NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) },
}));

import { currentUser } from "@clerk/nextjs/server";
import { POST } from "~/app/api/environment/create/route";
import { createMockRequest, mockUser } from "./_helpers";

describe("environment creation response", () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    (currentUser as jest.Mock).mockResolvedValue(mockUser);
  });
  afterEach(() => { global.fetch = originalFetch; });

  it("accepts the API's empty 201 without reporting a false creation failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 201, text: async () => "" });
    const response = await POST(createMockRequest("/api/environment/create", {
      method: "POST", body: { name: "production", agentId: "a0000000-0000-4000-8000-000000000001" },
    }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({});
  });

  it("preserves JSON returned by the API", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 201, text: async () => '{"environment_id":"c0000000-0000-4000-8000-000000000001"}' });
    const response = await POST(createMockRequest("/api/environment/create", {
      method: "POST", body: { name: "production", agentId: "a0000000-0000-4000-8000-000000000001" },
    }));
    expect(await response.json()).toEqual({ environment_id: "c0000000-0000-4000-8000-000000000001" });
  });
});
