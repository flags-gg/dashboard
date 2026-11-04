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

  // flags get the full width; environments and agent settings sit underneath
  return (
    <div className={"space-y-10"}>
      <FlagMatrix agent_id={agent_id} />
      <section className={"space-y-4"}>
        <h2 className={"text-lg font-semibold"}>Environments &amp; agent</h2>
        <div className={"grid gap-3 lg:grid-cols-3"}>
          <EnvironmentsList agent_id={agent_id} />
          <InfoBox agent_id={agent_id} />
        </div>
      </section>
    </div>
  )
}
