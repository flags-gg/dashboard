import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { logError } from "~/lib/logger";

// GET /api/agent/metrics?agent_id=…&days=7|14|30
export async function GET(request: Request) {
  if (!(await currentUser())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const params = new URL(request.url).searchParams
  const agentId = params.get("agent_id")
  const days = Number(params.get("days") ?? 14)
  if (!isUuid(agentId)) {
    return invalidId()
  }
  if (!Number.isInteger(days) || days < 1 || days > 90) {
    return NextResponse.json({ error: 'days must be 1-90' }, { status: 400 })
  }

  try {
    const res = await fetch(`${env.API_SERVER}/agent/${encodeURIComponent(agentId)}/metrics?days=${days}`, {
      headers: { ...(await authHeader()) },
      cache: 'no-store',
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to load metrics' }, { status: res.status === 404 ? 404 : 500 })
    }
    return new NextResponse(await res.text(), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    logError('Failed to load metrics', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
