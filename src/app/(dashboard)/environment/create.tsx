import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";

export default async function CreateEnvironment({ session, agent_id }: { session: Session, agent_id: string }) {
  return (
    <div className={"col-span-3"}>
      <Button>Create Environment</Button>
    </div>
  )
}
