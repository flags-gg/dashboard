"use client"

import {Button} from "~/components/ui/button";
import {type Session} from "next-auth";

export default function CreateAgent({ project_id }: { project_id: string }) {
  console.log("create agent", project_id)

  return (
    <div className={"col-span-3"}>
      <Button>Create Agent</Button>
    </div>
  )
}
