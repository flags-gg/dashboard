import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";

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

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${agentId}/environment`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
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
    const body = await response.json()

    return NextResponse.json(body)
  } catch (e) {
    console.error('Failed to create environment', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}