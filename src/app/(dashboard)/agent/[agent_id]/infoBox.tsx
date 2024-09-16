import { type Session } from "next-auth";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import CreateEnvironment from "~/app/(dashboard)/environment/create";
import { type FlagAgent } from "~/lib/statemanager";
import {getAgent} from "~/app/api/agent/agent";
import AgentInfo from "./info";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";
import {InfoBoxError} from "~/app/_components/InfoBoxError";

export default async function InfoBox({session, agent_id}: {session: Session, agent_id: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  let allowedToCreateEnv = false
  let agentInfo: FlagAgent
  try {
    agentInfo = await getAgent(session, agent_id)
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
          <CreateEnvironment session={session} agent_id={agent_id} />
        </CardFooter>
      )}
    </Card>
  );
}
