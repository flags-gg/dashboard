jest.mock("@clerk/nextjs/server", () => ({ auth: jest.fn() }));
jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));

import { auth } from "@clerk/nextjs/server";
import { logError } from "~/lib/logger";
import { POST } from "~/app/api/bugfixes/browser/route";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;

function request(body: unknown) {
  return new Request("http://localhost:3000/api/bugfixes/browser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("browser error relay", () => {
  beforeEach(() => jest.clearAllMocks());

  it("rejects unauthenticated reports", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
    expect((await POST(request({ message: "error" }))).status).toBe(401);
    expect(logError).not.toHaveBeenCalled();
  });

  it("reports validated errors from an authenticated browser", async () => {
    mockedAuth.mockResolvedValue({ userId: "user-1" } as Awaited<ReturnType<typeof auth>>);
    expect((await POST(request({ message: "render failed", stack: "stack", source: "uncaught", path: "/projects" }))).status).toBe(204);
    expect(logError).toHaveBeenCalledWith("dashboard browser error", expect.objectContaining({
      message: "render failed", stack: "stack",
    }), { source: "uncaught", path: "/projects" });
  });

  it("rejects invalid or oversized reports", async () => {
    mockedAuth.mockResolvedValue({ userId: "user-1" } as Awaited<ReturnType<typeof auth>>);
    expect((await POST(request({ message: "oops", source: "uncaught", path: "https://elsewhere" }))).status).toBe(400);
    expect((await POST(request({ message: "x".repeat(11_000), source: "uncaught", path: "/" }))).status).toBe(413);
    expect(logError).not.toHaveBeenCalled();
  });
});
