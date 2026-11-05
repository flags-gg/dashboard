jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(async () => ({ userId: "user_123", getToken: async () => "test-token" })),
}));
jest.mock("~/env", () => ({ env: { API_SERVER: "https://api.test.com" } }));
jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));
jest.mock("next/server", () => ({
  NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) },
}));

import { GET } from "~/app/api/user/details/route";
import { mockFetchFailure, mockFetchSuccess } from "./_helpers";

describe("user details proxy", () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; });

  it.each([401, 403, 404, 500, 503])("preserves backend status %s", async (status) => {
    global.fetch = mockFetchFailure(status);
    const response = await GET();
    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ error: "Failed to fetch user details" });
  });

  it("returns the authenticated user's account details", async () => {
    global.fetch = mockFetchSuccess({ onboarded: true, subject: "user_123" });
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ onboarded: true, subject: "user_123" });
  });
});
