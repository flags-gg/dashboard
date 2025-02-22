import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import {env} from "~/env";
import {AgentsData, FlagAgent} from "~/lib/interfaces";

export async function getAgents(project_id: string): Promise<AgentsData> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  const res = await fetch(`${env.API_SERVER}/project/${project_id}/agents`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-subject': user.id,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch agents')
  }
  return res.json()
}

export async function getAgent(agent_id: string): Promise<FlagAgent> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  const res = await fetch(`${env.API_SERVER}/agent/${agent_id}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-subject': user.id,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch agent')
  }
  return res.json()
}

export async function put(request: Request) {
  type UpdateAgentName = {
    name: string
    agentId: string
    enabled: boolean
  }

  const {agentId, name, enabled}: UpdateAgentName = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${agentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      body: JSON.stringify({
        name: name,
        enabled: enabled,
        agent_id: agentId
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({message: "Failed to update agent enabled status"}, { status: 500 })
    }

    return NextResponse.json({message: 'Agent enabled status updated successfully'})
  } catch (e) {
    console.error('Failed to update agent enabled status', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}


