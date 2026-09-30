import { error as bugfixesError, info as bugfixesInfo, loadConfigFromEnv, setDefaultConfig } from "bugfixes";
import { reportBrowserError } from "~/lib/report-browser-error";

function normalize(input: unknown): string {
  if (input instanceof Error) {
    return input.message;
  }

  if (typeof input === "string") {
    return input;
  }

  try {
    return JSON.stringify(input);
  } catch {
    return String(input);
  }
}

export function logInfo(message: string, ...details: unknown[]) {
  configureServerLogger();
  return bugfixesInfo(message, ...details.map(normalize));
}

function configureServerLogger() {
  // Next can bundle route handlers separately from instrumentation. Configure
  // the SDK instance used by this logger, while keeping credentials server-only.
  if (typeof window === "undefined") setDefaultConfig(loadConfigFromEnv());
}

export function logError(message: unknown, error?: unknown, ...details: unknown[]) {
  configureServerLogger();
  const normalizedMessage = normalize(message);

  if (typeof window !== "undefined") {
    reportBrowserError(normalizedMessage, error ?? (message instanceof Error ? message : undefined), "handled");
  }

  if (error instanceof Error) {
    return bugfixesError(normalizedMessage, error, ...details.map(normalize));
  }

  if (error !== undefined) {
    return bugfixesError(normalizedMessage, normalize(error), ...details.map(normalize));
  }

  return bugfixesError(normalizedMessage, ...details.map(normalize));
}
