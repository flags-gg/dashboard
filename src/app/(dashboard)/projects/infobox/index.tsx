import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import ProjectsInfo from "./info";
import InfoButtons from "./buttons";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function InfoBox() {
  const user = await currentUser();
  if (!user) {
    redirect('/')
  }

  return (
    <Card className={"min-h-[5rem] max-h-[18rem]"}>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>Projects Info</CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <ProjectsInfo />
      </CardContent>
      <InfoButtons />
    </Card>
  )
}
