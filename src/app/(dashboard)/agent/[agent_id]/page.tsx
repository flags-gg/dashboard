import EnvironmentsList from "./list";
import FlagMatrix from "./flags";
import {redirect} from "next/navigation";
import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getAgent } from "~/app/api/agent/agent";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { PageTabs } from "~/components/page-tabs";

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

  // flags are the day-to-day view; environments and agent settings are a tab away
  return (
    <PageTabs tabs={[
      { value: "flags", label: "Flags", content: <FlagMatrix agent_id={agent_id} /> },
      { value: "settings", label: "Environments & agent", content: (
        <div className={"grid items-start gap-3 lg:grid-cols-3"}>
          <EnvironmentsList agent_id={agent_id} />
          <InfoBox agent_id={agent_id} />
        </div>
      ) },
    ]} />
  )
}
