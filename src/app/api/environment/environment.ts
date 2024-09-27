import {type Session} from 'next-auth'
import {env} from "~/env";
import {type EnvironmentsData, type IEnvironment} from "~/lib/statemanager";

export async function getEnvironments(session: Session, agent_id: string): Promise<EnvironmentsData> {
  const apiUrl = `${env.API_SERVER}/agent/${agent_id}/environments`

  if (!session || !session.user) {
    throw Error('No session found')
  }
  if (!session.user.access_token || !session.user.id) {
    throw Error('No access token or user id found')
  }

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      throw Error('Failed to fetch environments')
    }

    return res.json()
  } catch (e) {
    console.error('Failed to fetch environments', e)
  }

  throw new Error('Internal Server Error')
}

export async function getEnvironment(session: Session, environment_id: string): Promise<IEnvironment> {
  const apiUrl = `${env.API_SERVER}/environment/${environment_id}`

  if (!session || !session.user) {
    throw Error('No session found')
  }
  if (!session.user.access_token || !session.user.id) {
    throw Error('No access token or user id found')
  }

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      throw Error('Failed to fetch environment')
    }

    return res.json()
  }
  catch (e) {
    console.error('Failed to fetch environment', e)
    throw new Error('Internal Server Error')
  }
}
