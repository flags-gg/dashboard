import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";

export default function Guide({session}: {session: Session}) {
  console.log("guide", session)

  return (
    <div className={"col-span-3"}>
      <Button>Guide</Button>
    </div>
  )
}
