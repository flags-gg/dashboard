import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";
import { env } from "~/env";

export async function PUT(request: Request) {
  type UpdateAgentName = {
    name: string
    agentId: string
    enabled: boolean
  }

  const { name, agentId, enabled }: UpdateAgentName = await request.json() as UpdateAgentName
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${agentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        name: name,
        enabled: enabled,
        agent_id: agentId
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to update agent name' }, { status: 500 })
    } else {
      return NextResponse.json({ message: 'Agent name updated successfully' })
    }
  } catch (e) {
    console.error('Failed to update agent name', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}