"use client"

import { useCompanyDetails } from "~/hooks/use-company-details";
import { Skeleton } from "~/components/ui/skeleton";

export default function Header() {
  const {data: companyInfo, isLoading} = useCompanyDetails();

  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  return (
    <header className={"col-span-3"}>
      <h1 className={"text-2xl font-semibold"}>{companyInfo?.company?.name}</h1>
    </header>
  );
}