import { auth } from "@clerk/nextjs/server";
import { logError } from "~/lib/logger";

type BrowserError = {
  message: string;
  stack?: string;
  source: string;
  path: string;
};

function isBrowserError(value: unknown): value is BrowserError {
  if (typeof value !== "object" || value === null) return false;
  const report = value as Record<string, unknown>;
  return typeof report.message === "string" && report.message.length > 0 && report.message.length <= 2_000
    && (report.stack === undefined || (typeof report.stack === "string" && report.stack.length <= 6_000))
    && typeof report.source === "string" && report.source.length <= 50
    && typeof report.path === "string" && report.path.length <= 500 && report.path.startsWith("/");
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response(null, { status: 401 });

  if (Number(request.headers.get("content-length")) > 10_000) {
    return new Response(null, { status: 413 });
  }

  const raw = await request.text();
  if (raw.length > 10_000) return new Response(null, { status: 413 });
  let report: unknown;
  try {
    report = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isBrowserError(report)) return new Response(null, { status: 400 });

  const error = new Error(report.message);
  if (report.stack) error.stack = report.stack;
  logError("dashboard browser error", error, { source: report.source, path: report.path });
  return new Response(null, { status: 204 });
}
