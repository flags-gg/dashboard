import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "~/server/auth"
import ProjectsInfo from "./Info";
import List from "../project/list";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className={"col-span-2"}>
        <h1 className={"text-2xl font-semibold"}>Projects</h1>
      </header>
      <List session={session} />
      <ProjectsInfo session={session} />
    </>
  )
}
