import { getServerAuthSession } from "~/server/auth";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {InfoButtons} from "./buttons";

export default async function InfoBox() {
  const session = await getServerAuthSession()

  if (!session) {
    throw new Error('No session found')
  }

  return (
    <Card className={"max-h-fit"}>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>User Options</CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        Avatar
      </CardContent>
      <InfoButtons />
    </Card>
  )
}