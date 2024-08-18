import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "~/server/auth"
import ProjectList from './ProjectList'

async function getProjects(session: any) {
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

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  try {
    const projects = await getProjects(session)
    return (
      <div>
        <h1>Projects</h1>
        <ProjectList projects={projects} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching projects:', error)
    return <div>Error loading projects. Please try again later.</div>
  }
}
