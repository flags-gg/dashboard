import { type Flag } from "~/lib/statemanager";
import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";

export async function fetchFlags(environment_id: string, accessToken: string, userId: string): Promise<Flag[]> {
  const res = await fetch(`${env.API_SERVER}/environment/${environment_id}/flags`, {
    headers: {
      'x-user-access-token': accessToken,
      'x-user-subject': userId,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch flags')
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export async function getFlags(environment_id: string): Promise<Flag[]> {
  const session = await getServerAuthSession();

  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  return fetchFlags(environment_id, session.user.access_token, session.user.id)
}