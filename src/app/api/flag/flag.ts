import {type Session} from 'next-auth'
import {env} from "~/env";
import {type Flag} from "~/lib/statemanager";

export async function getFlags(session: Session, environment_id: string): Promise<Flag[]> {
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  const res = await fetch(`${env.API_SERVER}/environment/${environment_id}/flags`, {
    headers: {
      'x-user-access-token': session.user.access_token,
      'x-user-subject': session.user.id,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch flags')
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}
