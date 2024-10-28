import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";
import { env } from "~/env";

type CreateEnv = {
  name: string
  agentId: string
}

export async function POST(request: Request) {
  const { name, agentId }: CreateEnv = await request.json() as CreateEnv
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${agentId}/environment`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        name: name,
        agentId: agentId,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to create environment' }, { status: 500 })
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await response.json()
    console.info("create env", body)

    return NextResponse.json(body)
  } catch (e) {
    console.error('Failed to create environment', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}