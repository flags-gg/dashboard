import {getServerSession} from "next-auth/next";
import {authOptions} from "~/server/auth";
import EnvironmentsList from "./list";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";

export default async function AgentPage({params}: {params: {agent_id: string}}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <header className={"col-span-2"}>
        <h1 className={"text-2xl font-semibold"}>Agent Environments</h1>
      </header>
      <EnvironmentsList session={session} agent_id={params.agent_id} />
      <InfoBox session={session} agent_id={params.agent_id} />
    </>
  )
}
