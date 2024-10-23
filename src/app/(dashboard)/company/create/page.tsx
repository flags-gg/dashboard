"use client"

import { useEffect } from "react";
import { useAtom } from "jotai";
import { companyCreationAtom, userAtom } from "~/lib/statemanager";

export default function CompanyCreate() {
  const [, setCompanyCreation] = useAtom(companyCreationAtom);
  const [userInfo] = useAtom(userAtom)

  console.info("userInfo", userInfo)

  useEffect(() => {
    setCompanyCreation(true);
  }, [setCompanyCreation]);

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Create Company</h1>
      </header>
      <div>Create Company</div>
    </div>
  )
}