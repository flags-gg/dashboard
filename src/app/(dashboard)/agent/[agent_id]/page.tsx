import {getServerSession} from "next-auth/next";
import {authOptions} from "~/server/auth";
import EnvironmentsList from "./list";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getAgent } from "~/app/api/agent/agent";

export async function generateMetadata({params}: {params: {agent_id: string}}): Promise<Metadata> {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }
  const agentInfo = await getAgent(params.agent_id)
  if (!agentInfo?.project_info?.name) {
    redirect('/projects')
  }

  return {
    title: `${agentInfo?.project_info?.name}: ${agentInfo?.name} Environments - Flags.gg`,
  }
}

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
      <EnvironmentsList agent_id={params.agent_id} />
      <InfoBox agent_id={params.agent_id} />
    </>
  )
}
