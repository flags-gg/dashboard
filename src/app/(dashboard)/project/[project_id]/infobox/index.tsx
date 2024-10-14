import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {type IProject} from "~/lib/statemanager";
import ProjectInfo from "./info";
import {getProject} from "~/app/api/project/project";
import {env} from "~/env";
import {InfoBoxError} from "~/app/components/InfoBoxError";
import Name from "./name";
import InfoButtons from "./buttons";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

export default async function InfoBox({project_id}: {project_id: string}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('No session found')
  }

  let projectInfo: IProject | null = null
  try {
    const data = await getProject(project_id)
    if (data instanceof Error) {
      console.error(data)
      return <InfoBoxError name={"project"} blurb={"project"} />
    }
    projectInfo = data
  } catch (e) {
    console.error(e)
    return <InfoBoxError name={"project"} blurb={"project"} />
  }

  if (!projectInfo) {
    return <InfoBoxError name={"project"} blurb={"project"} />
  }


  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <Name project_id={project_id} name={projectInfo.name} />
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <ProjectInfo projectInfo={projectInfo} session={session} flagServer={env.API_SERVER} />
      </CardContent>
      <InfoButtons session={session} />
    </Card>
  )
}
