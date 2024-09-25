import { type Session } from "next-auth";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {type IEnvironment} from "~/lib/statemanager";
import {getEnvironment} from "~/app/api/environment/environment";
import Info from "./info";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {InfoBoxError} from "~/app/components/InfoBoxError";
import InfoButtons from "./buttons";
import Head from "next/head";

export default async function InfoBox({session, environment_id}: {session: Session, environment_id: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  let environmentInfo: IEnvironment
  try {
    environmentInfo = await getEnvironment(session, environment_id)
  } catch (e) {
    console.error(e)
    return <InfoBoxError name={"environment"} blurb={"environment"} />
  }

  return (
    <Card>
      <Head>
        <title>{environmentInfo.name}</title>
      </Head>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>
          {environmentInfo.name}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={"bg-muted/10 border-0"} size={"icon"}>
                <Pencil className={"h-5 w-5"} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className={"grid gap-4"}>
                <div className={"space-y-2"}>
                  <h4 className={"font-medium leading-none"}>Environment Name</h4>
                  <p className={"text-sm text-muted-foreground"}>Set the environment name to something</p>
                </div>
                <div className={"grid gap-2"}>
                  <div className={"grid grid-cols-3 item-center gap-4"}>
                    <Label htmlFor={"name"}>Name</Label>
                    <Input id={"name"} type={"text"} defaultValue={environmentInfo.name} className={"col-span-2 h-8"} />
                  </div>
                </div>
                <div className={"grid gap-2"}>
                  <Button variant={"outline"}>Save</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <Info environmentInfo={environmentInfo} session={session} />
      </CardContent>
      <InfoButtons session={session} environmentId={environmentInfo.environment_id} menuId={environmentInfo.secret_menu.menu_id} />
    </Card>
  );
}
