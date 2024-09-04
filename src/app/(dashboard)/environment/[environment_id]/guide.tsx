import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";

export default async function Guide({session}: {session: Session}) {
  return (
    <div className={"col-span-3"}>
      <Button>Guide</Button>
    </div>
  )
}
