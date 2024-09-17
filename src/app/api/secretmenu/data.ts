import {type Session} from "next-auth";
import {type secretMenu} from "~/lib/statemanager";
import {env} from "~/env";

export async function getSecretMenu(session: Session, menu_id: string): Promise<secretMenu> {
  const apiUrl = `${env.API_SERVER}/secret-menu/${menu_id}`

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
    throw new Error('Failed to fetch secret menu')
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}
