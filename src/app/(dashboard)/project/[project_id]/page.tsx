import List from "./list";
import {getServerSession} from "next-auth/next";
import {authOptions} from "~/server/auth";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";

export default async function ProjectPage({params}: {params: {project_id: string}}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className={"col-span-2"}>
        <h1 className={"text-2xl font-semibold"}>Agents</h1>
      </header>
      <List session={session} project_id={params.project_id} />
      <InfoBox session={session} project_id={params.project_id} />
    </>
  )
}
