jest.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: (handler: unknown) => handler,
  createRouteMatcher: (patterns: string[]) => (req: { url: string }) =>
    patterns.some((p) => new RegExp(`^${p}$`).test(new URL(req.url).pathname)),
}));
jest.mock("next/server", () => ({
  NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) },
}));

import proxy from "~/proxy";

type Handler = (auth: unknown, req: unknown) => Promise<Response | undefined>;
const handler = proxy as unknown as Handler;

function setup(userId: string | null) {
  const protect = jest.fn();
  const auth = Object.assign(jest.fn(async () => ({ userId })), { protect });
  return { auth, protect };
}

function req(path: string, method = "GET", headers: Record<string, string> = {}, body: string | null = null) {
  return { url: `http://localhost:3000${path}`, method, headers: new Headers(headers), body };
}

describe("proxy", () => {
  it("leaves public routes alone", async () => {
    for (const path of ["/", "/api/uploadthing", "/api/webhooks"]) {
      const { auth, protect } = setup(null);
      expect(await handler(auth, req(path, "POST", { "content-type": "text/plain" }, "x"))).toBeUndefined();
      expect(protect).not.toHaveBeenCalled();
    }
  });

  it("protects dashboard pages, sending signed-out users to /", async () => {
    const { auth, protect } = setup(null);
    await handler(auth, req("/projects"));
    expect(protect).toHaveBeenCalledWith({ unauthenticatedUrl: "http://localhost:3000/" });
  });

  it("returns 401 for signed-out API calls", async () => {
    const { auth } = setup(null);
    expect((await handler(auth, req("/api/project/list")))?.status).toBe(401);
  });

  it("rejects non-JSON bodies on mutating API calls", async () => {
    const { auth } = setup("user_1");
    expect((await handler(auth, req("/api/flag", "POST", { "content-type": "text/plain" }, "x")))?.status).toBe(415);
    expect((await handler(auth, req("/api/flag", "POST", {}, "x")))?.status).toBe(415);
    expect((await handler(auth, req("/api/flag", "POST", { "content-type": "application/x-www-form-urlencoded" })))?.status).toBe(415);
  });

  it("lets JSON and bodiless requests through", async () => {
    const { auth } = setup("user_1");
    expect(await handler(auth, req("/api/flag", "POST", { "content-type": "application/json" }, "{}"))).toBeUndefined();
    expect(await handler(auth, req("/api/user/delete", "DELETE"))).toBeUndefined();
    expect(await handler(auth, req("/api/project/list"))).toBeUndefined();
  });
});
