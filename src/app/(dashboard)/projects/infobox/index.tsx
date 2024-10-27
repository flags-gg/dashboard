import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import ProjectsInfo from "./info";
import InfoButtons from "./buttons";
import { getServerAuthSession } from "~/server/auth";

export default async function InfoBox() {
  const session = await getServerAuthSession()

  if (!session) {
    throw new Error('No session found')
  }

  return (
    <Card className={"max-h-fit"}>
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
