/**
 * @jest-environment node
 */
jest.mock("@clerk/nextjs/server", () => ({ auth: jest.fn() }));
jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));

import { auth } from "@clerk/nextjs/server";
import { logError } from "~/lib/logger";
import { POST } from "~/app/api/bugfixes/browser/route";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;

function streamOf(text: string, chunkSize = 1024) {
  const bytes = new TextEncoder().encode(text);
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (let i = 0; i < bytes.length; i += chunkSize) controller.enqueue(bytes.slice(i, i + chunkSize));
      controller.close();
    },
  });
}

function request(body: unknown, headers: Record<string, string> = { "Content-Type": "application/json" }) {
  return { headers: new Headers(headers), body: streamOf(JSON.stringify(body)) } as unknown as Request;
}

let user = 0;
function signIn() {
  // fresh user per test so the rate limiter starts empty
  mockedAuth.mockResolvedValue({ userId: `user-${++user}` } as Awaited<ReturnType<typeof auth>>);
}

const valid = { message: "render failed", stack: "stack", source: "uncaught", path: "/projects" };

describe("browser error relay", () => {
  beforeEach(() => jest.clearAllMocks());

  it("rejects unauthenticated reports", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
    expect((await POST(request({ message: "error" }))).status).toBe(401);
    expect(logError).not.toHaveBeenCalled();
  });

  it("reports validated errors from an authenticated browser", async () => {
    signIn();
    expect((await POST(request(valid))).status).toBe(204);
    expect(logError).toHaveBeenCalledWith("dashboard browser error", expect.objectContaining({
      message: "render failed", stack: "stack",
    }), { source: "uncaught", path: "/projects" });
  });

  it("rejects invalid or oversized reports", async () => {
    signIn();
    expect((await POST(request({ message: "oops", source: "uncaught", path: "https://elsewhere" }))).status).toBe(400);
    expect((await POST(request({ message: "x".repeat(11_000), source: "uncaught", path: "/" }))).status).toBe(413);
    expect(logError).not.toHaveBeenCalled();
  });

  it("caps the streamed body even when content-length lies", async () => {
    signIn();
    const res = await POST(request({ ...valid, stack: "x".repeat(20_000) }, {
      "Content-Type": "application/json", "Content-Length": "10",
    }));
    expect(res.status).toBe(413);
    expect(logError).not.toHaveBeenCalled();
  });

  it("requires a JSON content type", async () => {
    signIn();
    expect((await POST(request(valid, { "Content-Type": "text/plain" }))).status).toBe(415);
    expect((await POST(request(valid, {}))).status).toBe(415);
  });

  it("rate limits each user to 30 reports a minute", async () => {
    signIn();
    for (let i = 0; i < 30; i++) {
      expect((await POST(request(valid))).status).toBe(204);
    }
    expect((await POST(request(valid))).status).toBe(429);
    signIn();
    expect((await POST(request(valid))).status).toBe(204);
  });
});
