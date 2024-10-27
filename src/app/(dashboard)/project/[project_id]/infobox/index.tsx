import {Card, CardContent, CardHeader} from "~/components/ui/card";
import ProjectInfo from "./info";
import Name from "./name";
import InfoButtons from "./buttons";
import { getServerAuthSession } from "~/server/auth";
import Delete from "./delete";
import { redirect } from "next/navigation";

export default async function InfoBox({project_id}: {project_id: string}) {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    redirect('/api/auth/signin')
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <div className={"grid gap-0.5"}>
          <Name project_id={project_id} />
        </div>
        <div className={"ml-auto flex items-center gap-1"}>
          <Delete project_id={project_id} />
        </div>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <ProjectInfo session={session} />
      </CardContent>
      <InfoButtons session={session} />
    </Card>
  )
}
