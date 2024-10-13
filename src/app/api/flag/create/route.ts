import {env} from "~/env";
import {NextResponse} from "next/server";
import { getServerAuthSession } from "~/server/auth";

type CreateFlag = {
  name: string
  environment_id: string
  agent_id: string
}

export async function POST(request: Request) {
  const { name, environment_id, agent_id }: CreateFlag = await request.json() as CreateFlag

  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/flag`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        name: name,
        environmentId: environment_id,
        agentId: agent_id,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to create flag' }, { status: 500 })
    }

    return NextResponse.json({
      enabled: false,
      details: {
        name: name,
      },
    })
  } catch (e) {
    console.error('Failed to create flag', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}