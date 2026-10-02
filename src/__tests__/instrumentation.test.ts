import { getDefaultConfig, resetDefaultConfig } from "bugfixes";
import { register, onRequestError } from "~/instrumentation";

jest.mock("~/lib/logger", () => ({ logError: jest.fn() }));
import { logError } from "~/lib/logger";

describe("Bugfixes server instrumentation", () => {
  const previousKey = process.env.BUGFIXES_AGENT_KEY;
  const previousSecret = process.env.BUGFIXES_AGENT_SECRET;

  afterEach(() => {
    if (previousKey === undefined) delete process.env.BUGFIXES_AGENT_KEY;
    else process.env.BUGFIXES_AGENT_KEY = previousKey;
    if (previousSecret === undefined) delete process.env.BUGFIXES_AGENT_SECRET;
    else process.env.BUGFIXES_AGENT_SECRET = previousSecret;
    resetDefaultConfig();
    jest.clearAllMocks();
  });

  it("loads private reporting credentials on the server", () => {
    process.env.BUGFIXES_AGENT_KEY = "test-key";
    process.env.BUGFIXES_AGENT_SECRET = "test-secret";
    register();
    expect(getDefaultConfig()).toEqual(expect.objectContaining({
      agentKey: "test-key",
      agentSecret: "test-secret",
    }));
  });

  it("reports uncaught Next.js request errors with route context", () => {
    const error = new Error("render failed");
    onRequestError(error, { path: "/project/one", method: "GET" }, {
      routePath: "/project/[project_id]", routeType: "render",
    });
    expect(logError).toHaveBeenCalledWith("dashboard uncaught server error", error, {
      path: "/project/one",
      method: "GET",
      route: "/project/[project_id]",
      type: "render",
    });
  });

  it("does not report Node's incoming-request abort after a client disconnect", () => {
    const error = Object.assign(new Error("aborted"), {
      code: "ECONNRESET",
      stack: "Error: aborted\n    at abortIncoming (node:_http_server:811:17)\n    at socketOnClose (node:_http_server:805:3)\n    at Socket.emit (node:events:520:28)",
    });
    onRequestError(error, { path: "/api/bugfixes/browser", method: "POST" }, {
      routePath: "/api/bugfixes/browser", routeType: "route",
    });
    expect(logError).not.toHaveBeenCalled();
  });

  it.each([
    Object.assign(new Error("socket hang up"), { code: "ECONNRESET" }),
    Object.assign(new Error("aborted"), { code: "ECONNRESET", stack: "Error: aborted\n    at fetch (node:internal/deps/undici:100:12)" }),
    new Error("aborted"),
    Object.assign(new Error("database failed"), { code: "ECONNRESET", stack: "Error: database failed\n    at socketOnClose (node:_http_server:805:3)" }),
  ])("still reports errors that do not match an incoming-request abort: %s", (error) => {
    onRequestError(error, { path: "/api/environment/create", method: "POST" }, {
      routePath: "/api/environment/create", routeType: "route",
    });
    expect(logError).toHaveBeenCalledWith("dashboard uncaught server error", error, expect.any(Object));
  });
});
