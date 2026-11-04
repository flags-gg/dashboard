import EnvironmentsList from "./list";
import FlagMatrix from "./flags";
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
    title: `Flags.gg - ${agentInfo?.project_info?.name}: ${agentInfo?.name} Flags`,
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
        <h1 className={"text-2xl font-semibold"}>Flags</h1>
      </header>
      <FlagMatrix agent_id={agent_id} />
      <InfoBox agent_id={agent_id} />
      <header className={"col-span-3 mt-6"}>
        <h2 className={"text-lg font-semibold"}>Environments</h2>
      </header>
      <EnvironmentsList agent_id={agent_id} />
    </div>
  )
}
