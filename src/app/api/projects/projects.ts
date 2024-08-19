import {Session} from 'next-auth'

export async function getProjects(session: Session) {
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.flags.gg/v1/projects'
    : 'http://localhost:8080/projects'

  if (!session || !session.user) {
    throw new Error('No session found')
  }

  const res = await fetch(apiUrl, {
    headers: {
      'x-user-access-token': session.user.token,
      'x-user-subject': session.user.id,
    },
    cache: 'no-store' // or 'force-cache' if you want to enable caching
  })

  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }

  return res.json()
}
