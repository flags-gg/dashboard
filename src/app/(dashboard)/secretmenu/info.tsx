import {type Session} from "next-auth";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";

export default async function InfoBox({session}: {session: Session}) {
  if (!session) {
    throw new Error('No session found')
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          Create Secret Menu
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
          <div className={"mb-5"}>
            <span>Drag the items into the grey area to create your secret menu code.</span>
            <br /><br />
            <span>Double click to remove them.</span>
          </div>
        </CardContent>
    </Card>
  )
}