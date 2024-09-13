import { type Session } from "next-auth";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {type IEnvironment} from "~/lib/statemanager";
import {getEnvironment} from "~/app/api/environment/environment";
import Info from "./info";
import CreateFlag from "~/app/(dashboard)/flags/create";
import Guide from './guide';
import {buttonVariants} from "~/components/ui/button";
import Link from "next/link";

export default async function InfoBox({session, environment_id}: {session: Session, environment_id: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  let environmentInfo: IEnvironment
  try {
    environmentInfo = await getEnvironment(session, environment_id)
  } catch (e) {
    console.error(e)
    return (
      <Card>
        <CardHeader className={"flex flex-row items-start bg-muted/50"}>
          <CardTitle className={"group flex items-center gap-2 text-lg"}>
            Failed to load environment
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          {environmentInfo.name}
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <Info environmentInfo={environmentInfo} session={session} />
      </CardContent>
      <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
        <CreateFlag session={session} environment_id={environment_id} />
        <Guide session={session} />
        {environmentInfo.secret_menu.enabled ? (
          <Link className={buttonVariants({variant: "default"})} href={`/secretmenu/${environmentInfo.secret_menu.menu_id}`}>Secret Menu</Link>
        ) : (
          <Link className={buttonVariants({variant: "secondary"})} href={`/secretmenu/`}>Secret Menu</Link>
        )}
      </CardFooter>
    </Card>
  );
}
