import {env} from "~/env";
import {type EnvironmentsData, type IEnvironment} from "~/lib/statemanager";
import { getServerAuthSession } from "~/server/auth";

export async function getEnvironments(agent_id: string): Promise<{ data: EnvironmentsData | null, error: Error | null }> {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  try {
    const res = await fetch(`${env.API_SERVER}/agent/${agent_id}/environments`, {
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      return { data: null, error: new Error('Failed to fetch environments') }
    }

    const data = await res.json() as EnvironmentsData
    return { data, error: null }
  } catch (e) {
    console.error('Failed to fetch environments', e)
    return { data: null, error: new Error('Internal Server Error') }
  }
}

export async function getEnvironment(environment_id: string): Promise<{ data: IEnvironment | null, error: Error | null }> {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  try {
    const res = await fetch(`${env.API_SERVER}/environment/${environment_id}`, {
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      return { data: null, error: new Error('Failed to fetch environment') }
    }

    const data = await res.json() as IEnvironment
    return { data, error: null }
  }
  catch (e) {
    console.error('Failed to fetch environment', e)
    return { data: null, error: new Error('Internal Server Error') }
  }
}