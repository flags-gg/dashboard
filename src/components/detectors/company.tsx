"use client"

import { Session } from "next-auth";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { useUserDetails } from "~/hooks/use-user-details";
import { companyCreationAtom } from "~/lib/statemanager";

export default function Company({session}: {session: Session}) {
  const {data: userData} = useUserDetails(session?.user?.id ?? "")
  const [companyCreated, setCompanyCreated] = useAtom(companyCreationAtom);

  useEffect(() => {
    if (!userData?.company_invite_code) {
      setCompanyCreated(true);
    }
  }, [userData])

  if (!companyCreated) {
    if (location.pathname === "/company/create") {
      return null
    }

    location.href = "/company/create"
  }

  return null
}