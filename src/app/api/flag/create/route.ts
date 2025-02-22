import {NextResponse} from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {env} from "~/env";

type CreateFlag = {
  name: string
  environment_id: string
  agent_id: string
}

export async function POST(request: Request) {
  const { name, environment_id, agent_id }: CreateFlag = await request.json() as CreateFlag
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/flag`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
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