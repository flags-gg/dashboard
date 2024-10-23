"use client"

import { companyCreationAtom, companyInfoAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export async function getCompanyInfo() {
  const res = await fetch(`/api/company/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/"
    },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error("Failed to fetch company info");
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json();
}

export default function CompanyDetector() {
  const [, setCompanyInfo] = useAtom(companyInfoAtom);
  const [companyCreation] = useAtom(companyCreationAtom);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {data: companyInfoData} = useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (companyInfoData) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setCompanyInfo(companyInfoData);
    }
  }, [companyInfoData, setCompanyInfo]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (companyInfoData?.company.enabled) {
    return null;
  }

  if (companyCreation) {
    return null;
  }

  if (typeof window !== "undefined") {
    if (window.location.href.includes("company") && window.location.href.includes("create")) {
      return null;
    }
    // eslint-disable-next-line
    window.location.href = "/company/create";
  }
}