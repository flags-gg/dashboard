import {type Session} from "next-auth";
import {Card, CardContent, CardFooter, CardHeader} from "~/components/ui/card";
import CreateAgent from "../../../agent/create";
import {type IProject} from "~/lib/statemanager";
import ProjectInfo from "./info";
import {getProject} from "~/app/api/project/project";
import {env} from "~/env";
import {InfoBoxError} from "~/app/_components/InfoBoxError";
import Name from "./name";

export default async function InfoBox({session, project_id}: {session: Session, project_id: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  let projectInfo: IProject
  try {
    projectInfo = await getProject(session, project_id)
  } catch (e) {
    console.error(e)
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
      <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
        <CreateAgent session={session} project_id={project_id} />
      </CardFooter>
    </Card>
  )
}
