"use client"

import { redirect } from "next/navigation";
import { companyCreationAtom, companyInfoAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "~/hooks/use-toast";
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
  const [_, setCompanyInfo] = useAtom(companyInfoAtom);
  const [companyCreation] = useAtom(companyCreationAtom);
  const {toast} = useToast()

  const {data: companyInfoData, error: companyInfoError} = useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (companyInfoError) {
    toast({
      title: "Error loading company info",
      description: "This might cause issues"
    })
  }

  useEffect(() => {
    if (companyInfoData) {
      setCompanyInfo(companyInfoData);
    }
  }, [companyInfoData, setCompanyInfo]);

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
    window.location.href = "/company/create";
  }
}