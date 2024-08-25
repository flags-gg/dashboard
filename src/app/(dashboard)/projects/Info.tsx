import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {type Session} from "next-auth";
import CreateProject from "~/app/(dashboard)/projects/CreateProject";

export default async function ProjectsInfo({ session }: { session: Session }) {
  return (
    <Card>
      <CardHeader>
        <h2 className={"text-xl font-semibold"}>Projects Info</h2>
      </CardHeader>
      <CardContent>
        <p>Here you can see the list of projects you have created and the number of agents you have used.</p>
        <CreateProject session={session} />
      </CardContent>
    </Card>
  )
}
