import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {InfoButtons} from "./buttons";
import UserImage from "./userImage";
import { currentUser } from "@clerk/nextjs/server";

export default async function InfoBox() {
  const user = await currentUser();
  if (!user) {
    return <></>
  }

  return (
    <Card className={"max-h-fit"}>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>User Options</CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <UserImage />
      </CardContent>
      <InfoButtons />
    </Card>
  )
}