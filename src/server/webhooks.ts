import "server-only";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { authHeader, isUuid } from "~/server/api";

// Only these company-scoped API operations may be proxied; the browser cannot pick an upstream URL.
export async function proxyWebhooks(request: Request, path: string[] = []) {
  if (!(await auth()).userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let upstream = "";
  if (path.length === 0 && ["GET", "POST"].includes(request.method)) upstream = "/company/webhooks";
  if (path.length === 1 && isUuid(path[0]) && ["PATCH", "DELETE"].includes(request.method)) upstream = `/company/webhooks/${encodeURIComponent(path[0])}`;
  if (path.length === 1 && path[0] === "deliveries" && request.method === "GET") upstream = "/company/webhook-deliveries";
  if (path.length === 3 && path[0] === "deliveries" && /^\d{1,19}$/.test(path[1] ?? "") && path[2] === "retry" && request.method === "POST") upstream = `/company/webhook-deliveries/${encodeURIComponent(path[1]!)}/retry`;
  if (!upstream) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const query = new URLSearchParams();
  const source = new URL(request.url).searchParams;
  for (const key of ["before", "endpoint"]) { const value = source.get(key); if (value) query.set(key, value); }
  try {
    const response = await fetch(`${env.API_SERVER}${upstream}?${query}`, {
      method: request.method, headers: { ...(await authHeader()), "Content-Type": "application/json" }, cache: "no-store",
      body: ["POST", "PATCH"].includes(request.method) ? await request.text() : undefined,
    });
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    const body: unknown = await response.json().catch(() => ({ error: "Webhook request failed" }));
    return NextResponse.json(body, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Webhook service unavailable" }, { status: 503 }); }
}
