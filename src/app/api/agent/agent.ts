import {type Session} from 'next-auth'
import {env} from "~/env";
import {type AgentsData, type FlagAgent} from "~/lib/statemanager";

export async function getAgents(session: Session, project_id: string): Promise<AgentsData> {
  const apiUrl = `${env.FLAGS_SERVER}/project/${project_id}/agents`

  if (!session || !session.user) {
    throw new Error('No session found')
  }
  if (!session.user.access_token || !session.user.id) {
    throw new Error('No access token or user id found')
  }

  const res = await fetch(apiUrl, {
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

export async function getAgent(session: Session, agent_id: string): Promise<FlagAgent> {
  const apiUrl = `${env.FLAGS_SERVER}/agent/${agent_id}`

  if (!session || !session.user) {
    throw new Error('No session found')
  }
  if (!session.user.access_token || !session.user.id) {
    throw new Error('No access token or user id found')
  }

  const res = await fetch(apiUrl, {
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

