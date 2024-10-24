"use client"

import { useEffect } from "react";
import { useAtom } from "jotai";
import { companyCreationAtom, companyInfoAtom, userAtom } from "~/lib/statemanager";
import { useCompanyRedirect } from "~/hooks/use-company-redirect";
import { Skeleton } from "~/components/ui/skeleton";

export default function CompanyCreate() {
  const [, setCompanyCreation] = useAtom(companyCreationAtom);
  const [companyInfo] = useAtom(companyInfoAtom);
  const [userInfo] = useAtom(userAtom)
  const {isLoading} = useCompanyRedirect()

  console.info("userInfo", userInfo, companyInfo)

  useEffect(() => {
    setCompanyCreation(true);
  }, [setCompanyCreation]);

  if (isLoading) {
    return <Skeleton className="min-w-full min-h-full rounded-xl" />
  }

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Create Company</h1>
      </header>
      <div>Create Company</div>
    </div>
  )
}