import EnvironmentsList from "./list";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getAgent } from "~/app/api/agent/agent";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export async function generateMetadata({params}: {params: Promise<{agent_id: string}>}): Promise<Metadata> {
  const {agent_id} = await params
  const agentInfo = await getAgent(agent_id)
  if (!agentInfo?.project_info?.name) {
    redirect('/projects')
  }

  return {
    title: `${agentInfo?.project_info?.name}: ${agentInfo?.name} Environments - Flags.gg`,
  }
}

export default async function AgentPage({params}: {params: Promise<{agent_id: string}>}) {
  const {agent_id} = await params
  const user = await currentUser();
  if (!user) {
    return (
      <div className={"flex justify-center"}>
        <SignIn />
      </div>
    )
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Agent Environments</h1>
      </header>
      <EnvironmentsList agent_id={agent_id} />
      <InfoBox agent_id={agent_id} />
    </div>
  )
}
