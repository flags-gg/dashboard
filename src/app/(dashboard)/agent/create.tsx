import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";

export default async function CreateAgent({ session, project_id }: { session: Session, project_id: string }) {
  console.log("create agent", project_id)
  console.info("create agent", session)

  return (
    <div className={"col-span-3"}>
      <Button>Create Agent</Button>
    </div>
  )
}
