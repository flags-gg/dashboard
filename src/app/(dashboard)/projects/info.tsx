"use client"

import {type Session} from "next-auth";
import {type CompanyLimits} from "~/lib/statemanager";
import {useMemo, useState} from "react";
import {useToast} from "~/hooks/use-toast";
import {getCompanyLimits} from "~/app/api/company/limits/limits";

export default function ProjectsInfo({ session }: { session: Session }) {
  const [companyLimits, setCompanyLimits] = useState<CompanyLimits | Error>();
  const {toast} = useToast()

  useMemo(() => {
    try {
      getCompanyLimits(session).then((companyLimits) => {
        setCompanyLimits(companyLimits);
      }).catch((e) => {
        throw new Error("Failed to fetch company limits");
      })
    } catch (e) {
      return <div>Error loading projects. Please try again later.</div>
    }
  }, [session])

  if (companyLimits instanceof Error) {
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
          <span>{companyLimits?.projects.allowed}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Projects Used</span>
          <span>{companyLimits?.projects?.used}</span>
        </li>
      </ul>
    </div>
  )
}
