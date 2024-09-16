"use client"

import {type CompanyLimits} from "~/lib/statemanager";

export default function ProjectsInfo({ companyLimits }: { companyLimits: CompanyLimits }) {
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
