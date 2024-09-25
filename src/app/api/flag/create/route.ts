import {env} from "~/env";
import {NextResponse} from "next/server";

type CreateFlag = {
  name: string
  environment_id: string
  agent_id: string
  sessionToken: string
  userId: string
}

export async function POST(request: Request) {
  const { name, environment_id, agent_id, sessionToken, userId }: CreateFlag = await request.json() as CreateFlag

  try {
    const apiUrl = `${env.API_SERVER}/flag`

    const response = await fetch(apiUrl, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
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