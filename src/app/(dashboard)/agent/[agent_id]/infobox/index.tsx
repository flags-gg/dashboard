import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import CreateEnvironment from "~/app/(dashboard)/environment/create";
import { type FlagAgent } from "~/lib/statemanager";
import {getAgent} from "~/app/api/agent/agent";
import AgentInfo from "./info";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";
import {InfoBoxError} from "~/app/components/InfoBoxError";

export default async function InfoBox({agent_id}: {agent_id: string}) {
  let allowedToCreateEnv = false
  let agentInfo = {} as FlagAgent
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
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          {agentInfo.name}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={"bg-muted/10 border-0"} size={"icon"}>
                <Pencil className={"h-5 w-5"} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              Agent Name Edit
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <AgentInfo agentInfo={agentInfo} />
      </CardContent>
      {allowedToCreateEnv && (
        <CardFooter className={"p-3 border-t-2 items-center justify-center"}>
          <CreateEnvironment agent_id={agent_id} />
        </CardFooter>
      )}
    </Card>
  );
}
