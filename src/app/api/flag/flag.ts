import {type Session} from 'next-auth'
import {env} from "~/env";
import {type Flag} from "~/lib/statemanager";

export async function getFlags(session: Session, environment_id: string): Promise<Flag[]> {
  const apiUrl = `${env.FLAGS_SERVER}/environment/${environment_id}/flags`

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
    throw new Error('Failed to fetch flags')
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

// export async function updateFlag(session: Session, flag_id: string, flagEnabled: boolean): Promise<void> {
//   const apiUrl = `${env.FLAGS_SERVER}/flag/${flag_id}`
//
//   if (!session || !session.user) {
//     throw new Error('No session found')
//   }
//   if (!session.user.access_token || !session.user.id) {
//     throw new Error('No access token or user id found')
//   }
//
//   const res = await fetch(apiUrl, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-user-access-token': session.user.access_token,
//       'x-user-subject': session.user.id,
//     },
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     body: JSON.stringify({enabled: flagEnabled}),
//     cache: 'no-store'
//   })
//   if (!res.ok) {
//     throw new Error('Failed to update flag')
//   }
//   return res.json()
// }
