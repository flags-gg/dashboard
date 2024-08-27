import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {type Session} from "next-auth";
import CreateAgent from "~/app/(dashboard)/project/create";
import {Separator} from "~/components/ui/separator";

export default async function ProjectsInfo({ session }: { session: Session }) {
  return (
    <Card>
      <CardHeader>
        <h2 className={"text-xl font-semibold"}>Projects Info</h2>
      </CardHeader>
      <CardContent>
        Projects Info goes here
        <Separator />
        <CreateAgent session={session} />
      </CardContent>
    </Card>
  )
}
