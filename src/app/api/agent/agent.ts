import {type Session} from 'next-auth'
import {env} from "~/env";
import {type AgentsData, type FlagAgent} from "~/lib/statemanager";
import { getServerAuthSession } from "~/server/auth";

export async function getAgents(project_id: string): Promise<AgentsData> {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  const res = await fetch(`${env.API_SERVER}/project/${project_id}/agents`, {
    headers: {
      'x-user-access-token': session.user.access_token,
      'x-user-subject': session.user.id,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch agents')
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export async function getAgent(agent_id: string): Promise<FlagAgent> {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  const res = await fetch(`${env.API_SERVER}/agent/${agent_id}`, {
    headers: {
      'x-user-access-token': session.user.access_token,
      'x-user-subject': session.user.id,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch agent')
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

