import {type Session} from "next-auth";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import ProjectsInfo from "./info";
import InfoButtons from "./buttons";

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
      <InfoButtons session={session} />
    </Card>
  )
}
