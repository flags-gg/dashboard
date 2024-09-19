"use client"

import {type Session} from "next-auth";
import {type CompanyLimits} from "~/lib/statemanager";
import {useMemo, useState} from "react";
import {useToast} from "~/hooks/use-toast";
import {getCompanyLimits} from "~/app/api/company/limits/limits";

export default function ProjectsInfo({ session }: { session: Session }) {
  const [companyLimits, setCompanyLimits] = useState({projectsAllowed: 0, projectsUsed: 0})
  const [retrieveError, setRetrieveError] = useState<Error | null>(null);
  const {toast} = useToast()

  useMemo(() => {
    try {
      getCompanyLimits(session).then((companyLimitsData) => {
        if (companyLimitsData instanceof Error) {
          throw new Error(`Failed to fetch company limits: ${companyLimits}`);
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

    return (
      <div className={"grid gap-3"}>
        <ul className={"grid gap-3"}>
          <li className={"flex items-center justify-between"}>
            <span className={"text-muted-foreground"}>Max Allowed Projects</span>
            <span>0</span>
          </li>
          <li className={"flex items-center justify-between"}>
            <span className={"text-muted-foreground"}>Projects Used</span>
            <span>0</span>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Max Allowed Projects</span>
          <span>{companyLimits.projectsAllowed}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Projects Used</span>
          <span>{companyLimits.projectsUsed}</span>
        </li>
      </ul>
    </div>
  )
}
