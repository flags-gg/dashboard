import {NextResponse} from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {env} from "~/env";
import { logError } from "~/lib/logger";

type CreateFlag = {
  name: string
  environment_id: string
  agent_id: string
}

export async function POST(request: Request) {
  const { name, environment_id, agent_id }: CreateFlag = await request.json() as CreateFlag
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ error: 'Failed to create flag' }, { status: 500 })
    }

    return NextResponse.json({
      enabled: false,
      details: {
        name: name,
      },
    })
  } catch (e) {
    logError('Failed to create flag', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}