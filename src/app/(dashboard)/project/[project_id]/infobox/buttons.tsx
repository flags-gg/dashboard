"use client"

import {CardFooter} from "~/components/ui/card";
import CreateAgent from "~/app/(dashboard)/agent/create";
import {useAtom} from "jotai";
import {useMemo, useState} from "react";
import {Session} from "next-auth";
import {projectAtom} from "~/lib/statemanager";
import {useToast} from "~/hooks/use-toast";
import {useFlags} from "@flags-gg/react-library";
import {getCompanyLimits} from "~/app/api/company/limits/limits";
import {buttonVariants} from "~/components/ui/button";
import Link from "next/link";

export default function InfoButtons({session}: {session: Session}) {
  const [companyLimits, setCompanyLimits] = useState({maxAgents: 0, usedAgents: 0})
  const [retrieveError, setRetrieveError] = useState<Error | null>(null)
  const [projectInfo] = useAtom(projectAtom)
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
        let used = 0
        for (const project of companyLimitsData.agents.used) {
          if (project.project_id === projectInfo.project_id) {
            used = project.used
          }
        }

        setCompanyLimits({
          maxAgents: companyLimitsData.agents.allowed,
          usedAgents: used
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

  if (companyLimits.maxAgents === 0 || companyLimits.usedAgents >= companyLimits.maxAgents) {
    return (
      <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
        {is("update limits")?.enabled() && <Link className={buttonVariants({variant: "default"})} href={`/company/limits`}>Update Limits</Link>}
      </CardFooter>
    )
  }

  return (
    <CardFooter className={"p-3 border-t-2 gap-2 items-center justify-center"}>
      {is("create agent")?.enabled() && <CreateAgent session={session} project_id={projectInfo.project_id} />}
      {is("update limits")?.enabled() && <Link className={buttonVariants({variant: "default"})} href={`/company/limits`}>Update Limits</Link>}
    </CardFooter>
  )
}
