import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";

export default async function CreateFlag({ session, environment_id }: { session: Session, environment_id: string }) {
  return (
    <div className={"col-span-3"}>
      <Button>Create Flag</Button>
    </div>
  )
}
