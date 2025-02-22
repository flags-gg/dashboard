import { env } from "~/env";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { currentUser } from "@clerk/nextjs/server";

type CloneEnv = {
  name: string
  environmentId: string
  agentId: string
}

export async function POST(request: Request) {
  const { name, environmentId, agentId }: CloneEnv = await request.json() as CloneEnv
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
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
      return NextResponse.json({ message: 'Failed to clone environment' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Environment cloned successfully' })
  } catch (e) {
    console.error('Failed to clone environment', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}