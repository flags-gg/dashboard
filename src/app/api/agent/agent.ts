import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import {env} from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import {AgentsData, FlagAgent} from "~/lib/interfaces";
import { logError } from "~/lib/logger";

export async function getAgents(project_id: string): Promise<AgentsData> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  if (!isUuid(project_id)) {
    throw new Error('Invalid project id')
  }

  const res = await fetch(`${env.API_SERVER}/project/${encodeURIComponent(project_id)}/agents`, {
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
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

  if (!isUuid(agent_id)) {
    throw new Error('Invalid agent id')
  }

  const res = await fetch(`${env.API_SERVER}/agent/${encodeURIComponent(agent_id)}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(agentId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${encodeURIComponent(agentId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
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
    logError('Failed to update agent enabled status', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


