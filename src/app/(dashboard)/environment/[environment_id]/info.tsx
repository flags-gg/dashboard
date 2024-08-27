import {type Session} from "next-auth";
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {Separator} from "~/components/ui/separator";
import CreateFlag from "~/app/(dashboard)/flags/create";

export default async function EnvironmentInfo({ session, environment_id }: { session: Session, environment_id: string }) {
  return (
    <Card>
      <CardHeader>
        <h2 className={"text-xl font-semibold"}>Agent Info</h2>
      </CardHeader>
      <CardContent>
        Environment Info goes here
        <Separator />
        <CreateFlag session={session} environment_id={environment_id} />
      </CardContent>
    </Card>
  )
}
