"use client"

import {type Session} from "next-auth";
import {useFlags} from "@flags-gg/react-library";
import {CardFooter} from "~/components/ui/card";
import Link from "next/link";
import CreateProject from "~/app/(dashboard)/project/create";
import {buttonVariants} from "~/components/ui/button";
import {useMemo, useState} from "react";
import {getCompanyLimits} from "~/app/api/company/limits/limits";
import {useToast} from "~/hooks/use-toast";

export default function InfoButtons({session}: {session: Session}) {
  const [companyLimits, setCompanyLimits] = useState({projectsAllowed: 0, projectsUsed: 0})
  const [retrieveError, setRetrieveError] = useState<Error | null>(null)
  const {is} = useFlags()
  const {toast} = useToast()

  if (!session) {
    throw new Error('No session found')
  }

  useMemo(() => {
    try {
      getCompanyLimits(session).then((companyLimitsData) => {
        if (companyLimitsData instanceof Error) {
          throw new Error(`Failed to fetch company limits: ${companyLimitsData}`);
        }
        setCompanyLimits({
          projectsAllowed: companyLimitsData.projects.allowed,
          projectsUsed: companyLimitsData.projects.used
        });
      }).catch((e) => {
        throw new Error(`Failed to fetch company limits: ${e}`);
      })
    } catch (e) {
      console.error("Failed to fetch company limits", e);
      if (e instanceof Error) {
        setRetrieveError(e);
      }
    }
  }, [session])

  if (retrieveError) {
    toast({
      title: "Error loading projects",
      description: "Please try again later.",
    })
  }


  if (companyLimits.projectsAllowed === 0 || companyLimits.projectsUsed >= companyLimits.projectsAllowed) {
    return (
      <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
        <Link className={buttonVariants({variant: "default"})} href={`/company/limits`}>Secret Menu</Link>
      </CardFooter>
    )
  }

  return (
    <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
      {is("create project")?.enabled() && <CreateProject session={session} />}
      {is("alter limits")?.enabled() && <Link className={buttonVariants({variant: "default"})} href={`/company/limits`}>Alter Limits</Link>}
    </CardFooter>
  )
}
