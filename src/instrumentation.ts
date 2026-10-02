import { loadConfigFromEnv, setDefaultConfig } from "bugfixes";
import { logError } from "~/lib/logger";

export function register() {
  setDefaultConfig(loadConfigFromEnv());
}

function isClientRequestAbort(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const candidate = error as { message?: unknown; code?: unknown; stack?: unknown };
  // Node destroys an unfinished IncomingMessage with this error when the
  // client disconnects. Require its origin so upstream ECONNRESETs still report.
  return candidate.message === "aborted"
    && candidate.code === "ECONNRESET"
    && typeof candidate.stack === "string"
    && /\bat (?:abortIncoming|socketOnClose) \((?:node:)?_http_server:\d+:\d+\)/.test(candidate.stack);
}

export function onRequestError(
  error: unknown,
  request: { path: string; method: string },
  context: { routePath: string; routeType: string },
) {
  if (isClientRequestAbort(error)) return;

  logError("dashboard uncaught server error", error, {
    path: request.path,
    method: request.method,
    route: context.routePath,
    type: context.routeType,
  });
}
