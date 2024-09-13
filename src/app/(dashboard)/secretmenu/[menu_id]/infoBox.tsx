import {type Session} from "next-auth";
import {type secretMenu} from "~/lib/statemanager";
import {getSecretMenu} from "~/app/api/secretmenu/data";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import Info from "./info";

export default async function InfoBox({session, menu_id}: {session: Session, menu_id: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  let secretMenuInfo: secretMenu
  try {
    secretMenuInfo = await getSecretMenu(session, menu_id)
  } catch(e) {
    console.error(e)
    return (
      <Card>
        <CardHeader className={"flex flex-row items-start bg-muted/50"}>
          <CardTitle className={"group flex items-center gap-2 text-lg"}>
            Failed to load secret menu info
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          {secretMenuInfo.environment_details.name} Secret Menu
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <Info secretMenuInfo={secretMenuInfo} session={session} />
      </CardContent>
    </Card>
  )
}
