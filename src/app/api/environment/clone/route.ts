import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { logError } from "~/lib/logger";

type CloneEnv = {
  name: string
  environmentId: string
  agentId: string
}

export async function POST(request: Request) {
  const { name, environmentId, agentId }: CloneEnv = await request.json() as CloneEnv
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${agentId}/${environmentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      body: JSON.stringify({
        name: name,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const detail = await response.text();
      logError('Failed to create child environment', { status: response.status, detail });
      const error = response.status < 500 && detail.trim()
        ? detail.trim()
        : 'Failed to create child environment';
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json() as { environmentId: string };
    return NextResponse.json({ environment_id: data.environmentId }, { status: 201 })
  } catch (e) {
    logError('Failed to clone environment', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
