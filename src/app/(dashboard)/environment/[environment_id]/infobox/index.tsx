import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {getEnvironment} from "~/app/api/environment/environment";
import Info from "./info";
import Name from "./name";
import {InfoBoxError} from "~/app/components/InfoBoxError";
import InfoButtons from "./buttons";
import Clone from "./clone"
import Delete from "./delete"

export default async function InfoBox({environment_id}: {environment_id: string}) {
  const { data: environmentInfo, error } = await getEnvironment(environment_id)

  if (error ?? !environmentInfo) {
    console.error(error)
    return <InfoBoxError name={"environment"} blurb={"Failed to fetch environment"} />
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <div className={"grid gap-0.5"}>
          <Name environment_id={environment_id} />
        </div>
        <div className={"ml-auto flex items-center gap-1"}>
          <Clone environment_id={environment_id} />
          <Delete environment_id={environment_id} />
        </div>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <Info environmentInfo={environmentInfo} />
      </CardContent>
      <InfoButtons environmentId={environmentInfo.environment_id} menuId={environmentInfo.secret_menu.menu_id} />
    </Card>
  );
}