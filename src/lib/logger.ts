import { error as bugfixesError, info as bugfixesInfo } from "bugfixes";

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
  return bugfixesInfo(message, ...details.map(normalize));
}

export function logError(message: unknown, error?: unknown, ...details: unknown[]) {
  const normalizedMessage = normalize(message);

  if (error instanceof Error) {
    return bugfixesError(normalizedMessage, error, ...details.map(normalize));
  }

  if (error !== undefined) {
    return bugfixesError(normalizedMessage, normalize(error), ...details.map(normalize));
  }

  return bugfixesError(normalizedMessage, ...details.map(normalize));
}
