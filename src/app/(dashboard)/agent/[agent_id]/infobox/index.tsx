import {Card, CardContent, CardFooter, CardHeader} from "~/components/ui/card";
import CreateEnvironment from "~/app/(dashboard)/environment/create";
import AgentInfo from "./info";
import Name from "./name";
import Delete from "./delete";

export default async function InfoBox({agent_id}: {agent_id: string}) {
  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <div className={"grid gap-0.5"}>
          <Name agent_id={agent_id} />
        </div>
        <div className={"ml-auto flex items-center gap-1"}>
          <Delete agent_id={agent_id} />
        </div>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <AgentInfo agent_id={agent_id} />
      </CardContent>
      <CardFooter className={"p-3 border-t-2 items-center justify-center"}>
        <CreateEnvironment agent_id={agent_id} />
      </CardFooter>
    </Card>
  );
}
