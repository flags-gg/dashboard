import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { logError } from "~/lib/logger";

// Removes a flag from every environment of the agent; the API archives it.
export async function DELETE(request: Request) {
  const { agent_id, name } = await request.json() as { agent_id: string, name: string }
  if (!(await currentUser())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isUuid(agent_id) || typeof name !== "string" || !name) {
    return invalidId()
  }

  try {
    const res = await fetch(`${env.API_SERVER}/agent/${encodeURIComponent(agent_id)}/flags/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: { ...(await authHeader()) },
      cache: 'no-store',
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to remove flag' }, { status: res.status === 404 ? 404 : 500 })
    }
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    logError('Failed to remove flag', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
