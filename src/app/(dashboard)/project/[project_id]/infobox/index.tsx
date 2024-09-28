import {type Session} from "next-auth";
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {type IProject} from "~/lib/statemanager";
import ProjectInfo from "./info";
import {getProject} from "~/app/api/project/project";
import {env} from "~/env";
import {InfoBoxError} from "~/app/components/InfoBoxError";
import Name from "./name";
import InfoButtons from "./buttons";

export default async function InfoBox({session, project_id}: {session: Session, project_id: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  let projectInfo: IProject | null = null
  try {
    const data = await getProject(session, project_id)
    if (data instanceof Error) {
      throw data
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
        <Name session={session} project_id={project_id} name={projectInfo.name} />
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <ProjectInfo projectInfo={projectInfo} session={session} flagServer={env.API_SERVER} />
      </CardContent>
      <InfoButtons session={session} />
    </Card>
  )
}
