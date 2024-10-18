import {Card, CardContent, CardFooter, CardHeader} from "~/components/ui/card";
import CreateEnvironment from "~/app/(dashboard)/environment/create";
import { type FlagAgent } from "~/lib/statemanager";
import {getAgent} from "~/app/api/agent/agent";
import AgentInfo from "./info";
import {InfoBoxError} from "~/app/components/InfoBoxError";
import Name from "./name";
import Delete from "./delete";

export default async function InfoBox({agent_id}: {agent_id: string}) {
  let allowedToCreateEnv = false
  const agentInfo = {} as FlagAgent
  try {
    const data = await getAgent(agent_id)
    agentInfo.id = data?.id
    agentInfo.name = data?.name
    agentInfo.agent_id = data?.agent_id
    agentInfo.request_limit = data?.request_limit
    agentInfo.environment_limit = data?.environment_limit
    agentInfo.environments = data?.environments
    agentInfo.project_info = data?.project_info
  } catch (e) {
    console.error(e)
    return <InfoBoxError name={"Agent"} blurb={"agent"} />
  }
  if (agentInfo.environments && agentInfo.environment_limit > agentInfo.environments.length) {
    allowedToCreateEnv = true
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <div className={"grid gap-0.5"}>
          <Name agent_id={agentInfo.agent_id} name={agentInfo.name} />
        </div>
        <div className={"ml-auto flex items-center gap-1"}>
          <Delete agent_id={agentInfo.agent_id} />
        </div>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <AgentInfo agentInfo={agentInfo} />
      </CardContent>
      {allowedToCreateEnv && (
        <CardFooter className={"p-3 border-t-2 items-center justify-center"}>
          <CreateEnvironment />
        </CardFooter>
      )}
    </Card>
  );
}
