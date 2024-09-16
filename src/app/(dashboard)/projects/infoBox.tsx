import {type CompanyLimits} from "~/lib/statemanager";
import {type Session} from "next-auth";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import ProjectsInfo from "./info";
import CreateProject from "~/app/(dashboard)/project/create";
import {getCompanyLimits} from "~/app/api/company/company";
import {buttonVariants} from "~/components/ui/button";
import Link from "next/link";
import {InfoBoxError} from "~/app/_components/InfoBoxError";

export default async function InfoBox({session}: {session: Session}) {
  if (!session) {
    throw new Error('No session found')
  }

  let companyLimits: CompanyLimits;
  try {
    companyLimits = await getCompanyLimits(session);
  } catch (e) {
    console.error(e);
    return <InfoBoxError name={"projects"} blurb={"company limits"} />
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-start bg-muted/50"}>
        <CardTitle className={"group flex items-center gap-2 text-lg"}>Projects Info</CardTitle>
      </CardHeader>
      <CardContent className={"p-6 text-sm"}>
        <ProjectsInfo companyLimits={companyLimits} />
      </CardContent>
      {companyLimits.projects.allowed > companyLimits.projects.used && (
        <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
          <CreateProject session={session} />
          <Link className={buttonVariants({variant: "secondary"})} href={"/company/limits"}>Increase Limits</Link>
        </CardFooter>
      )}
    </Card>
  )
}
