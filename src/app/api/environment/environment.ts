import { currentUser } from "@clerk/nextjs/server";
import {env} from "~/env";
import { EnvironmentsData, IEnvironment } from "~/lib/interfaces";

export async function getEnvironments(agent_id: string): Promise<{ data: EnvironmentsData | null, error: Error | null }> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  try {
    const res = await fetch(`${env.API_SERVER}/agent/${agent_id}/environments`, {
      headers: {
        'x-user-subject': user.id,
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
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  try {
    const res = await fetch(`${env.API_SERVER}/environment/${environment_id}`, {
      headers: {
        'x-user-subject': user.id,
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
