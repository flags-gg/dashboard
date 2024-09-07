"use client"

import {type BreadCrumb, breadCrumbAtom, type CompanyLimits} from "~/lib/statemanager";
import {useAtom} from "jotai";
import {useEffect} from "react";

export default function ProjectsInfo({ companyLimits }: { companyLimits: CompanyLimits }) {
  const [, setBreadcrumbs] = useAtom(breadCrumbAtom)
  useEffect(() => {
    setBreadcrumbs([])
    const breadcrumbs: Array<BreadCrumb> = [
      {title: "Projects", url: "/projects"},
    ]
    setBreadcrumbs(breadcrumbs)
  }, [setBreadcrumbs])

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Max Allowed Projects</span>
          <span>{companyLimits.projects.allowed}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Projects Used</span>
          <span>{companyLimits.projects.used}</span>
        </li>
      </ul>
    </div>
  )
}
