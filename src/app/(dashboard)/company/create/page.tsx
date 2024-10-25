"use client"

import { useEffect } from "react";
import { useAtom } from "jotai";
import { companyCreationAtom, companyInfoAtom, userAtom } from "~/lib/statemanager";

async function injectUser() {
  const res = await fetch(`/api/user/details`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user details");
  }

  return await res.json() as { real_name: string, image: string }
}

async function addToCompanyIfExists(domain: string) {
  const res = await fetch(`/api/company/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      domain: domain
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch company details");
  }

  return await res.json() as { company: { name: string, domain: string, invite_code: string } }
}

export default function CompanyCreate() {
  const [, setCompanyCreation] = useAtom(companyCreationAtom);
  const [companyInfo] = useAtom(companyInfoAtom);
  const [userInfo] = useAtom(userAtom)

  console.info("userInfo", userInfo, companyInfo)

  useEffect(() => {
    setCompanyCreation(true);
    injectUser().then((user) => {
      console.info("inject user data", user)
    }).catch((e) => {
      console.error("error in injectUser", e)
    })
    addToCompanyIfExists(userInfo.domain).then((company) => {
      console.info("added to domain", userInfo.domain, company)
    }).catch((e) => {
      console.error("error in addToCompanyIfExists", e)
    })
  }, [setCompanyCreation, userInfo]);

  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Create Company</h1>
      </header>
      <div>Create Company</div>
    </div>
  )
}