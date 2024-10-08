import {type Session} from "next-auth";
import {type secretMenu} from "~/lib/statemanager";
import {getSecretMenu} from "~/app/api/secretmenu/data";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import Info from "./info";
import {InfoBoxError} from "~/app/components/InfoBoxError";
import InfoButtons from "./buttons";

export default async function InfoBox({session, menu_id}: {session: Session, menu_id: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  let secretMenuInfo: secretMenu
  try {
    secretMenuInfo = await getSecretMenu(session, menu_id)
  } catch(e) {
    console.error(e)
    return <InfoBoxError name={"secret menu"} blurb={"secret menu"} />
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          {secretMenuInfo.environment_details.name} Secret Menu
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <div className={"mb-5"}>
          <span>Drag the items into the grey area to create your secret menu code.</span>
          <br /><br />
          <span>Double click to remove them.</span>
        </div>

        <Info secretMenuInfo={secretMenuInfo} session={session} />
      </CardContent>
      <InfoButtons menuId={menu_id} />
    </Card>
  )
}
