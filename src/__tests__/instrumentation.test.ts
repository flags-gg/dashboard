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
});
