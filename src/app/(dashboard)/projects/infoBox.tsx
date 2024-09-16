import {type Session} from "next-auth";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import ProjectsInfo from "./info";
import CreateProject from "~/app/(dashboard)/project/create";
import {buttonVariants} from "~/components/ui/button";
import Link from "next/link";

export default async function InfoBox({session}: {session: Session}) {
  if (!session) {
    throw new Error('No session found')
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>Projects Info</CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <ProjectsInfo session={session} />
      </CardContent>
      <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
        <CreateProject session={session} />
        <Link className={buttonVariants({variant: "secondary"})} href={"/company/limits"}>Alter Limits</Link>
      </CardFooter>
    </Card>
  )
}
