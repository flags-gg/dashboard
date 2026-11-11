import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authHeader } from "~/server/api";
import { env } from "~/env";

export async function GET(request: Request, { params }: { params: Promise<{ section: string }> }) {
  if (!(await auth()).userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { section } = await params;
  if (!["me", "stats", "companies", "users", "operations"].includes(section)) return new NextResponse(null, { status: 404 });
  const search = new URL(request.url).searchParams;
  const query = new URLSearchParams();
  for (const key of ["q", "page"]) { const value = search.get(key); if (value) query.set(key, value); }
  try {
    const response = await fetch(`${env.API_SERVER}/staff/${section}?${query}`, { headers: await authHeader(), cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: response.status === 404 ? "Not found" : "Unable to load staff data" }, { status: response.status });
    return NextResponse.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Staff service unavailable" }, { status: 503 }); }
}
