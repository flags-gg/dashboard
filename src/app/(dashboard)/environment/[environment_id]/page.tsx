import InfoBox from "./infobox";
import { type Metadata } from "next";
import { getEnvironment } from "~/app/api/environment/environment";
import { getAgentFlags } from "~/app/api/agent/flags";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { logError } from "~/lib/logger";
import { PageIntro } from "~/components/page-intro";
import { PageTabs } from "~/components/page-tabs";
import CreateFlag from "./flags/create";
import { EnvFlagTable, type EnvFlag } from "./flags/env-flags";

export async function generateMetadata({params}: {params: Promise<{environment_id: string}>}): Promise<Metadata> {
  const {environment_id} = await params
  const { data: environmentInfo, error } = await getEnvironment(environment_id)

  if (error ?? !environmentInfo) {
    logError('Failed to fetch environment:', error)
  }

  return {
    title: `Flags.gg - ${environmentInfo?.project_name}: ${environmentInfo?.agent_name} - ${environmentInfo?.name} Flags`,
  }
}

async function Flags({ environment_id }: { environment_id: string }) {
  try {
    const { data: env, error } = await getEnvironment(environment_id);
    if (error ?? !env) throw error ?? new Error("environment not found");
    const all = await getAgentFlags(env.agent_id);
    const i = all.environments.findIndex(e => e.environment_id === environment_id);
    const next = all.environments[i + 1];
    const flags: EnvFlag[] = all.flags.flatMap(f => {
      const state = f.states.find(s => s.environment_id === environment_id);
      return state ? [{ name: f.name, ticket: f.ticket, state, inNext: !!next && f.states.some(s => s.environment_id === next.environment_id) }] : [];
    });
    return <>
      <PageIntro title={`${env.name} flags`}
        description={`Flags in ${env.name}. Click a state to toggle it or roll it out to a percentage of visitors.`}
        action={<CreateFlag environment_id={environment_id} agent_id={env.agent_id} />} />
      <EnvFlagTable env={env.name} next={next?.name} agentId={env.agent_id} flags={flags} />
    </>;
  } catch (e) {
    logError("environment flags", e);
    return <p className="rounded-lg border p-4 text-sm">Error loading flags.</p>;
  }
}

export default async function EnvironmentPage({params}: {params: Promise<{environment_id: string}>}) {
  const {environment_id} = await params
  const user = await currentUser();
  if (!user) {
    return (
      <div className={"flex justify-center"}>
        <SignIn />
      </div>
    )
  }

  return (
    <PageTabs tabs={[
      { value: "flags", label: "Flags", content: <Flags environment_id={environment_id} /> },
      { value: "settings", label: "Environment settings", content: <div className="max-w-4xl"><InfoBox environment_id={environment_id} /></div> },
    ]} />
  )
}
