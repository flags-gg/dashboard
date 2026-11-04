import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isFlagId, invalidId } from "~/server/api";
import { logError } from "~/lib/logger";

// Sets the percentage of visitors that see a flag (in one environment) when it is enabled.
export async function PATCH(request: Request) {
  const { flag_id, rollout } = await request.json() as { flag_id: string, rollout: number }
  if (!(await currentUser())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isFlagId(flag_id)) {
    return invalidId()
  }
  if (!Number.isInteger(rollout) || rollout < 0 || rollout > 100) {
    return NextResponse.json({ error: 'Rollout must be 0-100' }, { status: 400 })
  }

  try {
    const res = await fetch(`${env.API_SERVER}/flag/${encodeURIComponent(flag_id)}/rollout`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({ rollout }),
      cache: 'no-store',
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to set rollout' }, { status: 500 })
    }
    return NextResponse.json({ rollout })
  } catch (e) {
    logError('Failed to set rollout', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
