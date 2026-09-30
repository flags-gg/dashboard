import { loadConfigFromEnv, setDefaultConfig } from "bugfixes";
import { logError } from "~/lib/logger";

export function register() {
  setDefaultConfig(loadConfigFromEnv());
}

export function onRequestError(
  error: unknown,
  request: { path: string; method: string },
  context: { routePath: string; routeType: string },
) {
  logError("dashboard uncaught server error", error, {
    path: request.path,
    method: request.method,
    route: context.routePath,
    type: context.routeType,
  });
}
