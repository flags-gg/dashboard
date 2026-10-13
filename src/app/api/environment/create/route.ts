import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { logError } from "~/lib/logger";

type CreateEnv = {
  name: string
  agentId: string
}

export async function POST(request: Request) {
  const { name, agentId }: CreateEnv = await request.json() as CreateEnv
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(agentId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${encodeURIComponent(agentId)}/environment`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      body: JSON.stringify({
        name: name,
        agentId: agentId,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create environment' }, { status: 500 })
    }
    // The API currently returns an empty 201 after successfully inserting the environment.
    const text = await response.text()
    const body: unknown = text.trim() ? JSON.parse(text) : {}

    return NextResponse.json(body)
  } catch (e) {
    logError('Failed to create environment', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
