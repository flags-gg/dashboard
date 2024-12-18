"use client"

import { useCompanyDetails } from "~/hooks/use-company-details";
import { NewLoader } from "~/components/ui/new-loader";

export default function Details() {
  const {data: companyInfo, isLoading} = useCompanyDetails();

  if (isLoading) {
    return <NewLoader />
  }

  return (
    <ul className={"grid gap-3 mb-4"}>
      <li className={"flex items-center justify-between"}>
        <span>Price</span>
        <span>$0</span>
      </li>
      <li className={"flex items-center justify-between"}>
        <span>Team Members</span>
        <span>{companyInfo?.payment_plan?.team_members ?? 0}</span>
      </li>
      <li className={"flex items-center justify-between"}>
        <span>Projects</span>
        <span>{companyInfo?.payment_plan?.projects ?? 0}</span>
      </li>
      <li className={"flex items-center justify-between"}>
        <span>Agents Per Project</span>
        <span>{companyInfo?.payment_plan?.agents ?? 0}</span>
      </li>
      <li className={"flex items-center justify-between"}>
        <span>Environments Per Agent</span>
        <span>{companyInfo?.payment_plan?.environments ?? 0}</span>
      </li>
    </ul>
  )
}