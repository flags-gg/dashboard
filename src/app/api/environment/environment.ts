import {type Session} from 'next-auth'
import {env} from "~/env";
import {type EnvironmentsData, type IEnvironment} from "~/lib/statemanager";

export async function getEnvironments(session: Session, agent_id: string): Promise<EnvironmentsData> {
  const apiUrl = `${env.FLAGS_SERVER}/agent/${agent_id}/environments`

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
    throw new Error('Failed to fetch environments')
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export async function getEnvironment(session: Session, environment_id: string): Promise<IEnvironment> {
  const apiUrl = `${env.FLAGS_SERVER}/environment/${environment_id}`

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
    throw new Error('Failed to fetch environment')
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}
