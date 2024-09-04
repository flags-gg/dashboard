import {type Session} from "next-auth";
import {type secretMenu} from "~/lib/statemanager";
import {getSecretMenu} from "~/app/api/secretmenu/data";

export default async function InfoBox({session, menu_id}: {session: Session, menu_id: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  let secretMenuInfo: secretMenu
  try {
    secretMenuInfo = await getSecretMenu(session, menu_id)
  } catch(e) {
    console.error(e)
    return <div>Error loading secret menu info</div>
  }

  console.info("secretMenuInfo", secretMenuInfo)

  return <></>
}
