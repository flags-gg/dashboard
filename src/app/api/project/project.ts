import {type Session} from 'next-auth'
import {env} from "~/env";
import {type ProjectsData} from "~/lib/statemanager";

export async function getProjects(session: Session): Promise<ProjectsData> {
  const apiUrl = `${env.FLAGS_SERVER}/projects`

  if (!session || !session.user) {
    throw new Error('No session found')
  }

  const res = await fetch(apiUrl, {
    headers: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      'x-user-access-token': session.user.token,
      'x-user-subject': session.user.id,
    },
    cache: 'no-store' // or 'force-cache' if you want to enable caching
  })

  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}
