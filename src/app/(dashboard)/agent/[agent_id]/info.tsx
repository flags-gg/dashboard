import {type Session} from "next-auth";
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {Separator} from "~/components/ui/separator";
import CreateEnvironment from "~/app/(dashboard)/environment/create";

export default async function AgentInfo({ session, agent_id }: { session: Session, agent_id: string }) {
  return (
    <Card>
      <CardHeader>
        <h2 className={"text-xl font-semibold"}>Agent Info</h2>
      </CardHeader>
      <CardContent>
        Agent Info goes here
        <Separator />
        <CreateEnvironment session={session} agent_id={agent_id} />
      </CardContent>
    </Card>
  )
}
