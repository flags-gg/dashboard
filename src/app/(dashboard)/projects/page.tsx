import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "~/server/auth"
import ProjectListContainer from './ProjectListContainer'

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className={"grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2"}>
      <h1>Projects</h1>
      <ProjectListContainer session={session} />
    </div>
  )
}
