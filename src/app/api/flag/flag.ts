import {type Session} from 'next-auth'
import {env} from "~/env";
import {type Flags} from "~/lib/statemanager";

export async function getFlags(session: Session, environment_id: string): Promise<Flags> {
  const apiUrl = `${env.FLAGS_SERVER}/environment/${environment_id}/flags`
  if (!session || !session.user) {
    throw new Error('No session found')
  }

  const res = await fetch(apiUrl, {
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

export async function updateFlag(session: Session, flag_id, flagEnabled): Promise<void> {
  const apiUrl = `${env.FLAGS_SERVER}/flag/${flag_id}`
  if (!session || !session.user) {
    throw new Error('No session found')
  }

  const res = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-user-access-token': session.user.access_token,
      'x-user-subject': session.user.id,
    },
    body: JSON.stringify({enabled: flagEnabled}),
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to update flag')
  }
}
