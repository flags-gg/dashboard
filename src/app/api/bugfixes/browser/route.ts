import { auth } from "@clerk/nextjs/server";
import { logError } from "~/lib/logger";

type BrowserError = {
  message: string;
  stack?: string;
  source: string;
  path: string;
};

const MAX_BYTES = 10_000;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

// ponytail: in-memory, per-instance limiter. With N instances a user gets N x 30/min; move to a shared store (e.g. Redis) if scaled out.
const hits = new Map<string, { start: number; count: number }>();

function rateLimited(userId: string, now = Date.now()): boolean {
  const entry = hits.get(userId);
  if (!entry || now - entry.start >= WINDOW_MS) {
    if (hits.size >= 10_000) hits.clear(); // bound memory
    hits.set(userId, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > MAX_PER_WINDOW;
}

// Reads the body but aborts once it exceeds MAX_BYTES, whatever content-length claims.
async function readCapped(body: ReadableStream<Uint8Array> | null): Promise<string | null> {
  if (!body) return "";
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

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

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return new Response(null, { status: 415 });
  }
  if (Number(request.headers.get("content-length")) > MAX_BYTES) {
    return new Response(null, { status: 413 });
  }
  if (rateLimited(userId)) return new Response(null, { status: 429 });

  const raw = await readCapped(request.body);
  if (raw === null) return new Response(null, { status: 413 });
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
