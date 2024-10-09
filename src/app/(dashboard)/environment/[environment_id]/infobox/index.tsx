import { type Session } from "next-auth";
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {getEnvironment} from "~/app/api/environment/environment";
import Info from "./info";
import Name from "./name";
import {InfoBoxError} from "~/app/components/InfoBoxError";
import InfoButtons from "./buttons";

export default async function InfoBox({session, environment_id}: {session: Session, environment_id: string}) {
  if (!session) {
    return <InfoBoxError name={"session"} blurb={"No session found"} />
  }

  const { data: environmentInfo, error } = await getEnvironment(session, environment_id)

  if (error ?? !environmentInfo) {
    console.error(error)
    return <InfoBoxError name={"environment"} blurb={"Failed to fetch environment"} />
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <Name session={session} environment_id={environment_id} />
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <Info environmentInfo={environmentInfo} />
      </CardContent>
      <InfoButtons session={session} environmentId={environmentInfo.environment_id} menuId={environmentInfo.secret_menu.menu_id} />
    </Card>
  );
}