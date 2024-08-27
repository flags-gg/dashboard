import {type Session} from "next-auth";
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {Separator} from "~/components/ui/separator";
import CreateAgent from "../../agent/create";

export default async function ProjectInfo({session, project_id}: {session: Session, project_id: string}) {
  return (
    <Card>
      <CardHeader>
        <h2 className={"text-xl font-semibold"}>Project Info</h2>
      </CardHeader>
      <CardContent>
        Project Info goes here
        <Separator />
        <CreateAgent session={session} project_id={project_id} />
      </CardContent>
    </Card>
  )
}
