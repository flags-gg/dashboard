import {type Session} from 'next-auth'
import {env} from "~/env";
import {type CompanyLimits} from "~/lib/statemanager";

export async function getCompanyLimits(session: Session): Promise<CompanyLimits> {
  const apiUrl = `${env.FLAGS_SERVER}/company/limits`

  if (!session || !session.user) {
    throw new Error('No session found')
  }

  const res = await fetch(apiUrl, {
    headers: {
      'x-user-access-token': session.user.access_token,
      'x-user-subject': session.user.id,
    },
    cache: 'no-store' // or 'force-cache' if you want to enable caching
  })

  if (!res.ok) {
    throw new Error('Failed to fetch company details')
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}
